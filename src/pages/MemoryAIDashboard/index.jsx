import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import Header from '../../components/ui/Header';
import KPICard from '../main-analytics-dashboard/components/KPICard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// ==========================================
// HELPERS
// ==========================================
const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-secondary)'];

const STATUS_BADGE = {
    completed: { label: 'Complétée', className: 'bg-success/15 text-success' },
    in_progress: { label: 'En cours', className: 'bg-warning/15 text-warning' },
    failed: { label: 'Échouée', className: 'bg-error/15 text-error' },
    created: { label: 'Créée', className: 'bg-muted text-muted-foreground' },
};

function timeAgo(dateStr) {
    if (!dateStr) return '—';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `il y a ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `il y a ${diffD}j`;
}

// ==========================================
// MOCK DATA (à remplacer par useQuery plus tard)
// ==========================================
const now = new Date();

const MOCK_STATS = {
    totalSessions: 47,
    completedSessions: 32,
    averageScore: 72.4,
    totalTimeSpent: 18640,
    mostMissedTopics: [
        'Intégrales doubles',
        'Équations différentielles',
        'Probabilités conditionnelles',
        'Algèbre linéaire',
        'Séries de Fourier',
    ],
};

const MOCK_SESSIONS = Array.from({ length: 20 }, (_, i) => {
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    createdDate.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));
    const statuses = ['completed', 'completed', 'completed', 'in_progress', 'failed', 'created'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const types = ['open', 'mcq', 'true_false'];
    const numQ = Math.floor(Math.random() * 15) + 5;
    const questions = Array.from({ length: numQ }, (_, qi) => ({
        id: `q-${i}-${qi}`,
        type: types[Math.floor(Math.random() * types.length)],
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        isLacune: Math.random() > 0.7,
    }));
    const correctCount = Math.floor(numQ * (0.4 + Math.random() * 0.5));
    const lacunesCount = Math.floor(Math.random() * 5);
    const tokensUsed = Math.floor(Math.random() * 8000) + 1000;

    return {
        id: `session-${i + 1}`,
        title: [
            'Analyse Mathématique - Chap. 3',
            'Mécanique Quantique Avancée',
            'Thermodynamique & Transferts',
            'Algèbre Linéaire - Exercices',
            'Probabilités & Statistiques',
            'Chimie Organique - Réactions',
            'Électromagnétisme - Maxwell',
            'Biologie Cellulaire - Mitose',
            'Histoire Contemporaine - XXe',
            'Physique des Particules',
        ][i % 10],
        status,
        createdAt: createdDate.toISOString(),
        completedAt: status === 'completed' ? new Date(createdDate.getTime() + 3600000).toISOString() : null,
        pdf: {
            fileName: `cours-${i + 1}.pdf`,
            fileSize: Math.floor(Math.random() * 5000000) + 500000,
        },
        lacunes: Array.from({ length: lacunesCount }, (_, li) => ({
            topic: MOCK_STATS.mostMissedTopics[li % MOCK_STATS.mostMissedTopics.length],
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        })),
        questions,
        answers: questions.map((_, ai) => ({
            isCorrect: ai < correctCount,
            scoreObtained: ai < correctCount ? 1 : 0,
        })),
        stats: {
            totalQuestions: numQ,
            answeredQuestions: status === 'completed' ? numQ : Math.floor(numQ * 0.6),
            correctAnswers: correctCount,
            globalScore: Math.round((correctCount / numQ) * 100),
            lacunesCount,
            timeSpent: Math.floor(Math.random() * 3600) + 600,
        },
        aiMeta: {
            totalTokensUsed: tokensUsed,
            pdfAnalyzedAt: createdDate.toISOString(),
            questionsGeneratedAt: new Date(createdDate.getTime() + 60000).toISOString(),
        },
    };
}).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// ==========================================
// CUSTOM TOOLTIP (shared style)
// ==========================================
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                {payload.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-medium text-foreground data-text">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const MemoryAIDashboard = () => {
    const navigate = useNavigate();
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // ── DONNÉES (mock pour le moment) ──
    const sessions = MOCK_SESSIONS;
    const stats = MOCK_STATS;
    const isLoading = false;

    // ── REFRESH ──
    const handleRefresh = async () => {
        setRefreshing(true);
        // TODO: remplacer par refetch des queries GraphQL
        setTimeout(() => {
            setLastRefresh(new Date());
            setRefreshing(false);
        }, 800);
    };

    // ── KPI CARDS ──
    const totalTokens = useMemo(
        () => sessions.reduce((sum, s) => sum + (s.aiMeta?.totalTokensUsed || 0), 0),
        [sessions]
    );

    const kpiData = [
        {
            title: 'Total Sessions',
            value: stats.totalSessions,
            icon: 'BarChart2',
            iconColor: 'var(--color-primary)',
        },
        {
            title: 'Sessions Complétées',
            value: stats.completedSessions,
            icon: 'CheckCircle',
            iconColor: 'var(--color-success)',
        },
        {
            title: 'Score Moyen Global',
            value: `${stats.averageScore.toFixed(1)}%`,
            icon: 'Target',
            iconColor: 'var(--color-warning)',
        },
        {
            title: 'Tokens IA Utilisés',
            value: totalTokens.toLocaleString('fr-FR'),
            icon: 'Cpu',
            iconColor: 'var(--color-secondary)',
        },
    ];

    // ── LINE CHART — Sessions par jour (30 jours) ──
    const sessionsPerDay = useMemo(() => {
        const map = {};
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            map[key] = 0;
        }
        sessions.forEach((s) => {
            const key = new Date(s.createdAt).toISOString().slice(0, 10);
            if (key in map) map[key]++;
        });
        return Object.entries(map).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            sessions: count,
        }));
    }, [sessions]);

    // ── PIE CHART — Types de questions ──
    const questionTypes = useMemo(() => {
        const counts = { open: 0, mcq: 0, true_false: 0 };
        sessions.forEach((s) =>
            (s.questions || []).forEach((q) => {
                if (q.type in counts) counts[q.type]++;
            })
        );
        return [
            { name: 'Ouverte', value: counts.open },
            { name: 'QCM', value: counts.mcq },
            { name: 'Vrai/Faux', value: counts.true_false },
        ].filter((d) => d.value > 0);
    }, [sessions]);

    // ── DERNIÈRE ACTIVITÉ — 5 dernières sessions ──
    const recentSessions = useMemo(() => sessions.slice(0, 5), [sessions]);

    // ── SKELETON HELPER ──
    const Skeleton = ({ className = '' }) => (
        <div className={`bg-card rounded-lg border border-border p-6 animate-pulse ${className}`}>
            <div className="h-full bg-muted rounded"></div>
        </div>
    );

    // ── RENDER ──
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-[128px] lg:pt-[144px] px-4 lg:px-6 pb-8">
                <div className="max-w-[1600px] mx-auto">

                    {/* ── TITLE BAR ── */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                                Tableau de Bord IA Mémorisation
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground">
                                Analyse des sessions d'apprentissage et performance IA
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="default"
                                onClick={handleRefresh}
                                loading={refreshing}
                                iconName="RefreshCw"
                                iconPosition="left"
                                className="hidden md:flex"
                            >
                                Actualiser
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                loading={refreshing}
                                className="md:hidden"
                            >
                                <Icon name="RefreshCw" size={18} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/main-analytics-dashboard')}
                                iconName="ArrowLeft"
                                iconPosition="left"
                            >
                                Dashboard
                            </Button>
                        </div>
                    </div>

                    {/* Last refresh */}
                    <div className="flex items-center gap-2 mb-6 text-xs md:text-sm text-muted-foreground caption">
                        <Icon name="Clock" size={14} />
                        <span>
                            Dernière mise à jour:{' '}
                            {lastRefresh?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* ══════════════════════════════════════ */}
                    {/* KPI CARDS                              */}
                    {/* ══════════════════════════════════════ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-muted rounded w-1/3"></div>
                                </div>
                            ))
                            : kpiData.map((kpi, i) => <KPICard key={i} {...kpi} />)}
                    </div>

                    {/* ══════════════════════════════════════ */}
                    {/* LINE CHART — Sessions par jour         */}
                    {/* ══════════════════════════════════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
                        <div className="lg:col-span-8">
                            {isLoading ? (
                                <Skeleton className="h-[400px]" />
                            ) : (
                                <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
                                    <div className="mb-4 md:mb-6">
                                        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                                            Sessions par jour
                                        </h3>
                                        <p className="text-sm text-muted-foreground caption mt-1">
                                            Évolution sur les 30 derniers jours
                                        </p>
                                    </div>
                                    <div className="w-full h-64 md:h-80 lg:h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={sessionsPerDay} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                                                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} allowDecimals={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                                                <Line
                                                    type="monotone"
                                                    dataKey="sessions"
                                                    name="Sessions"
                                                    stroke="var(--color-primary)"
                                                    strokeWidth={2}
                                                    dot={{ fill: 'var(--color-primary)', r: 3 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ══════════════════════════════════════ */}
                        {/* PIE CHART — Types de questions          */}
                        {/* ══════════════════════════════════════ */}
                        <div className="lg:col-span-4">
                            {isLoading ? (
                                <Skeleton className="h-[400px]" />
                            ) : (
                                <div className="bg-card rounded-lg p-4 md:p-6 border border-border h-full">
                                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
                                        Répartition des Questions
                                    </h3>
                                    <p className="text-sm text-muted-foreground caption mb-4">
                                        Par type de question
                                    </p>
                                    {questionTypes.length > 0 ? (
                                        <div className="w-full h-56 md:h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={questionTypes}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={80}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {questionTypes.map((_, i) => (
                                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">
                                            Aucune question disponible
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══════════════════════════════════════ */}
                    {/* TABLE — Sessions                       */}
                    {/* ══════════════════════════════════════ */}
                    {isLoading ? (
                        <Skeleton className="h-[400px] mb-6" />
                    ) : (
                        <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
                            <div className="p-4 md:p-6 border-b border-border">
                                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                                    Sessions de Mémorisation
                                </h3>
                                <p className="text-sm text-muted-foreground caption mt-1">
                                    Dernières 20 sessions
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/30">
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Titre</th>
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">PDF</th>
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                                            <th className="text-center px-4 py-3 font-medium text-muted-foreground">Questions</th>
                                            <th className="text-center px-4 py-3 font-medium text-muted-foreground">Score</th>
                                            <th className="text-center px-4 py-3 font-medium text-muted-foreground">Lacunes</th>
                                            <th className="text-center px-4 py-3 font-medium text-muted-foreground">Tokens</th>
                                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sessions.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                                                    Aucune session trouvée
                                                </td>
                                            </tr>
                                        ) : (
                                            sessions.map((s) => {
                                                const badge = STATUS_BADGE[s.status] || STATUS_BADGE.created;
                                                return (
                                                    <tr key={s.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                                                            {s.title || '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground text-xs max-w-[150px] truncate">
                                                            {s.pdf?.fileName || '—'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                                                                {badge.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-foreground">
                                                            {s.stats?.totalQuestions ?? '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-medium text-foreground">
                                                            {s.stats?.globalScore != null ? `${s.stats.globalScore}%` : '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-foreground">
                                                            {s.stats?.lacunesCount ?? '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-muted-foreground text-xs">
                                                            {s.aiMeta?.totalTokensUsed?.toLocaleString('fr-FR') || '—'}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                                            {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════ */}
                    {/* TOP LACUNES + DERNIÈRE ACTIVITÉ        */}
                    {/* ══════════════════════════════════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">

                        {/* Top Lacunes */}
                        {isLoading ? (
                            <Skeleton className="h-[300px]" />
                        ) : (
                            <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                                        Top Lacunes
                                    </h3>
                                </div>
                                {stats?.mostMissedTopics && stats.mostMissedTopics.length > 0 ? (
                                    <ul className="space-y-3">
                                        {stats.mostMissedTopics.map((topic, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-error/15 text-error text-xs font-bold flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm text-foreground truncate block">{topic}</span>
                                                </div>
                                                <div className="flex-shrink-0 w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-error/70 rounded-full"
                                                        style={{ width: `${Math.max(100 - i * 15, 20)}%` }}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                                        Aucune lacune identifiée
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dernière Activité */}
                        {isLoading ? (
                            <Skeleton className="h-[300px]" />
                        ) : (
                            <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon name="Activity" size={20} className="text-primary" />
                                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                                        Dernière Activité
                                    </h3>
                                </div>
                                {recentSessions.length > 0 ? (
                                    <ul className="space-y-3">
                                        {recentSessions.map((s) => (
                                            <li
                                                key={s.id}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {s.title || 'Session sans titre'}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="Target" size={12} />
                                                            {s.stats?.globalScore != null ? `${s.stats.globalScore}%` : '—'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="AlertTriangle" size={12} />
                                                            {s.stats?.lacunesCount ?? 0} lacunes
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="flex-shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                                                    {timeAgo(s.createdAt)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                                        Aucune activité récente
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default MemoryAIDashboard;
