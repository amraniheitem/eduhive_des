import { gql } from '@apollo/client';

export const GET_SUBJECTS_WITH_CONTENT = gql`
  query GetSubjectsWithContent {
    subjects {
      id
      name
      description
      price
      category
      level
      status
      
      stats {
        studentsEnrolled
        totalSales
        revenue
      }
      
      ratingsStats {
        averageRating
        totalRatings
      }
      
      videos {
        id
        title
        description
        url
        duration
        fileSize
        format
        order
        uploadedAt
      }
      
      pdfs {
        id
        title
        description
        url
        fileSize
        pageCount
        uploadedAt
      }
      
      assignedTeachers {
        teacher {
          user {
            firstName
            lastName
          }
        }
      }
      
      createdAt
    }
  }
`;
