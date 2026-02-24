import { gql } from '@apollo/client';

/**
 * Login mutation
 */
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        phone
        role
        status
        adminProfile {
          department
          permissions
          lastLogin
        }
      }
    }
  }
`;

/**
 * Mutation to create a new admin (Super Admin only)
 */
export const CREATE_ADMIN_MUTATION = gql`
  mutation CreateAdminUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $phone: String!
    $department: String!
    $permissions: [String!]!
  ) {
    createAdminUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      department: $department
      permissions: $permissions
    ) {
      token
      user {
        id
        email
        firstName
        lastName
        role
        status
      }
    }
  }
`;


/**
 * Mutation to toggle 2FA
 */
export const TOGGLE_2FA_MUTATION = gql`
  mutation Toggle2FA($userId: ID!, $enabled: Boolean!) {
    toggleTwoFactor(userId: $userId, enabled: $enabled) {
      success
      message
    }
  }
`;

/**
 * Mutation to update user (activate/deactivate, edit info)
 */
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $phone: String
    $status: UserStatus
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      status: $status
    ) {
      id
      firstName
      lastName
      phone
      status
      email
      role
    }
  }
`;

/**
 * Mutation to create a new subject
 */
export const createSubjectMutation = (name, description, price, category, level) => gql`
  mutation {
    createSubject(
      name: "${name}"
      description: "${description}"
      price: ${price}
      category: "${category}"
      level: ${level}
    ) {
      id
      name
      price
      status
      createdAt
    }
  }
`;

// Keep the old export name for backward compatibility
export const CREATE_SUBJECT_MUTATION = gql`
  mutation CreateSubject(
    $name: String!
    $description: String!
    $price: Float!
    $category: String!
    $level: String!
  ) {
    createSubject(
      name: $name
      description: $description
      price: $price
      category: $category
      level: $level
    ) {
      id
      name
      price
      status
      createdAt
    }
  }
`;

/**
 * Mutation to update a subject
 */
export const UPDATE_SUBJECT_MUTATION = gql`
  mutation UpdateSubject(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $status: SubjectStatus
  ) {
    updateSubject(
      id: $id
      name: $name
      description: $description
      price: $price
      status: $status
    ) {
      id
      name
      description
      price
      status
      updatedAt
    }
  }
`;

/**
 * Mutation to assign a teacher to a subject
 */
export const ASSIGN_TEACHER_MUTATION = gql`
  mutation AssignTeacherToSubject(
    $subjectId: ID!
    $teacherId: ID!
  ) {
    assignTeacherToSubject(
      subjectId: $subjectId
      teacherId: $teacherId
    ) {
      id
      name
      assignedTeachers {
        teacher {
          user {
            firstName
            lastName
          }
        }
        assignedAt
      }
    }
  }
`;

/**
 * Mutation to remove a teacher from a subject
 */
export const REMOVE_TEACHER_FROM_SUBJECT_MUTATION = gql`
  mutation RemoveTeacherFromSubject(
    $subjectId: ID!
    $teacherId: ID!
  ) {
    removeTeacherFromSubject(
      subjectId: $subjectId
      teacherId: $teacherId
    ) {
      id
      name
      assignedTeachers {
        teacherId
        teacher {
          user {
            firstName
            lastName
          }
        }
      }
    }
  }
`;

/**
 * Mutation to toggle user status (activate/deactivate)
 */
export const TOGGLE_USER_STATUS_MUTATION = gql`
  mutation ToggleUserStatus($userId: ID!) {
    toggleUserStatus(userId: $userId) {
      id
      email
      firstName
      lastName
      status
      role
      verified
      teacherProfile {
        subjects
        educationLevels
        totalEarnings
        withdrawable
      }
    }
  }
`;
