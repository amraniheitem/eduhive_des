import { gql } from '@apollo/client';

export const GET_MY_MEMORY_SESSIONS = gql`
  query GetMyMemorySessions($status: MemorySessionStatus, $limit: Int, $offset: Int) {
    myMemorySessions(status: $status, limit: $limit, offset: $offset) {
      id
      title
      status
      createdAt
      completedAt
      pdf {
        fileName
        fileSize
      }
      lacunes {
        topic
        severity
      }
      questions {
        id
        type
        difficulty
        isLacune
      }
      answers {
        isCorrect
        scoreObtained
      }
      stats {
        totalQuestions
        answeredQuestions
        correctAnswers
        globalScore
        lacunesCount
        timeSpent
      }
      aiMeta {
        totalTokensUsed
        pdfAnalyzedAt
        questionsGeneratedAt
      }
    }
  }
`;

export const GET_MEMORY_STATS = gql`
  query GetMemoryStats {
    memoryStats {
      totalSessions
      completedSessions
      averageScore
      totalTimeSpent
      mostMissedTopics
    }
  }
`;
