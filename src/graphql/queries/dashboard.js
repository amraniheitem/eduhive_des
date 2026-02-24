import { gql } from '@apollo/client';

export const GET_DASHBOARD_KPIS = gql`
  query GetDashboardKPIs($dateRange: DateRangeInput) {
    dashboardKPIs(dateRange: $dateRange) {
      totalEnrollments {
        value
        numericValue
        change
        changeType
        trend {
          direction
          description
        }
      }
      retentionRate {
        value
        numericValue
        change
        changeType
        trend {
          direction
          description
        }
      }
      totalRevenue {
        value
        numericValue
        change
        changeType
        trend {
          direction
          description
        }
      }
      studentSatisfaction {
        value
        numericValue
        change
        changeType
        trend {
          direction
          description
        }
      }
    }
  }
`;

export const GET_MONTHLY_TRENDS = gql`
  query GetMonthlyTrends($months: Int) {
    monthlyTrends(months: $months) {
      month
      year
      enrollment
      completion
      revenue
    }
  }
`;

export const GET_TOP_COURSES = gql`
  query GetTopCourses($limit: Int) {
    topPerformingCourses(limit: $limit) {
      id
      name
      studentsCount
      averageRating
      status
      revenue
    }
  }
`;

export const GET_AT_RISK_STUDENTS = gql`
  query GetAtRiskStudents($limit: Int) {
    atRiskStudents(limit: $limit) {
      subjectId
      subjectName
      studentsAtRisk
      severity
    }
  }
`;

export const GET_DEPARTMENT_PERFORMANCE = gql`
  query GetDepartmentPerformance {
    departmentPerformance {
      category
      icon
      students
      retention
      satisfaction
      revenue
      details {
        activeCourses
        teachers
        successRate
      }
    }
  }
`;

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id
      type
      description
      timestamp
      user {
        id
        firstName
        lastName
      }
      subject {
        id
        name
      }
      metadata
    }
  }
`;
