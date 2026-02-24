import { gql } from '@apollo/client';

export const GET_STUDENT_ANALYTICS_KPIS = gql`
  query GetStudentAnalyticsKPIs($dateRange: DateRangeInput) {
    studentAnalyticsKPIs(dateRange: $dateRange) {
      activeStudents {
        value
        numericValue
        change
        changeType
        description
      }
      successRate {
        value
        numericValue
        change
        changeType
        description
      }
      retentionRate {
        value
        numericValue
        change
        changeType
        description
      }
      atRiskCount {
        value
        numericValue
        change
        changeType
        description
      }
      averageGrade {
        value
        numericValue
        change
        changeType
        description
      }
      attendanceRate {
        value
        numericValue
        change
        changeType
        description
      }
    }
  }
`;

export const GET_STUDENT_PROGRESSION_FUNNEL = gql`
  query GetStudentProgressionFunnel {
    studentProgressionFunnel {
      stage
      count
      percentage
      dropoffRate
    }
  }
`;

export const GET_STUDENT_ENGAGEMENT_HEATMAP = gql`
  query GetStudentEngagementHeatmap($dateRange: DateRangeInput) {
    studentEngagementHeatmap(dateRange: $dateRange) {
      dayOfWeek
      hour
      activityCount
      intensity
    }
  }
`;

export const GET_AT_RISK_STUDENTS_LIST = gql`
  query GetAtRiskStudentsList($limit: Int, $riskLevel: RiskLevel) {
    atRiskStudentsList(limit: $limit, riskLevel: $riskLevel) {
      studentId
      firstName
      lastName
      email
      enrolledCourses
      averageProgress
      lastActivity
      riskLevel
      riskFactors
    }
  }
`;

export const GET_STUDENT_PERFORMANCE_LIST = gql`
  query GetStudentPerformanceList(
    $limit: Int
    $offset: Int
    $orderBy: String
    $filters: StudentFiltersInput
  ) {
    studentPerformanceList(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      filters: $filters
    ) {
      students {
        studentId
        firstName
        lastName
        email
        educationLevel
        enrolledCourses
        completedCourses
        averageProgress
        averageGrade
        lastActivity
        status
      }
      total
      hasMore
    }
  }
`;
