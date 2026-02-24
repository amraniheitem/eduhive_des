import { gql } from '@apollo/client';

export const GET_STUDENTS_PERFORMANCE = gql`
  query GetStudentsPerformance {
    students {
      id
      user {
        id
        firstName
        lastName
        email
        phone
        status
      }
      parentName
      educationLevel
      currentYear
      credit
      enrolledSubjects {
        id
        name
        price
        level
      }
      createdAt
    }
  }
`;

export const GET_ACTIVE_TEACHERS = gql`
  query GetActiveTeachers {
    users(role: TEACHER, status: ACTIVE) {
      id
      email
      firstName
      lastName
      phone
      role
      status
      verified
      createdAt
      teacherProfile {
        id
        subjects
        educationLevels
        credit
        totalEarnings
        withdrawable
        selectedSubjects {
          id
          name
          price
        }
        ratingsStats {
          averageRating
          totalRatings
        }
      }
    }
  }
`;

export const GET_ALL_TEACHERS = gql`
  query GetAllTeachers {
    users(role: TEACHER) {
      id
      email
      firstName
      lastName
      phone
      role
      status
      verified
      createdAt
      teacherProfile {
        id
        subjects
        educationLevels
        credit
        totalEarnings
        withdrawable
        selectedSubjects {
          id
          name
          price
        }
        ratingsStats {
          averageRating
          totalRatings
        }
      }
    }
  }
`;

export const GET_INACTIVE_TEACHERS = gql`
  query GetInactiveTeachers {
    users(role: TEACHER, status: INACTIVE) {
      id
      email
      firstName
      lastName
      phone
      role
      status
      verified
      createdAt
      teacherProfile {
        id
        subjects
        educationLevels
        credit
        totalEarnings
        withdrawable
      }
    }
  }
`;

export const GET_SUBJECTS = gql`
  query GetSubjects {
    subjects {
      id
      name
      description
      price
      category
      level
      status
      stats {
        totalSales
        revenue
        studentsEnrolled
        teachersCount
      }
      contentStats {
        totalVideos
        totalPdfs
        totalDuration
        totalSize
      }
      ratingsStats {
        averageRating
        totalRatings
      }
      assignedTeachers {
        teacherId
        teacher {
          user {
            firstName
            lastName
            email
          }
        }
      }
      enrolledStudents {
        studentId
        student {
          user {
            firstName
            lastName
          }
        }
        progress
      }
      createdAt
    }
  }
`;

export const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      id
      user {
        id
        email
        firstName
        lastName
        phone
        role
        status
        createdAt
      }
      department
      permissions
      lastLogin
      createdAt
    }
  }
`;
