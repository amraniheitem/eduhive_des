import React from "react";
import { HashRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import TeacherPerformance from './pages/teacher-performance';
import FinancialAnalytics from './pages/financial-analytics';
import StudentAnalytics from './pages/student-analytics';
import CourseAnalytics from './pages/course-analytics';
import MainAnalyticsDashboard from './pages/main-analytics-dashboard';
import Login from './pages/Login/index.jsx';
import Settings from './pages/Settings/index.jsx';
import MemoryAIDashboard from './pages/MemoryAIDashboard';

const Routes = () => {
  return (
    <HashRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/main-analytics-dashboard"
            element={
              <ProtectedRoute>
                <MainAnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-performance"
            element={
              <ProtectedRoute>
                <TeacherPerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-analytics"
            element={
              <ProtectedRoute>
                <FinancialAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-analytics"
            element={
              <ProtectedRoute>
                <StudentAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-analytics"
            element={
              <ProtectedRoute>
                <CourseAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memory-analytics"
            element={
              <ProtectedRoute>
                <MemoryAIDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </HashRouter>
  );
};

export default Routes;
