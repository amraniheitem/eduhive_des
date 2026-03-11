import { gql } from '@apollo/client';

// AUTH
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

// INSCRIPTION ÉTUDIANT
export const REGISTER_STUDENT_STEP1 = gql`
  mutation RegisterStudentStep1(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $parentName: String!
    $educationLevel: EducationLevel!
    $currentYear: String
  ) {
    registerStudentStep1(
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      parentName: $parentName
      educationLevel: $educationLevel
      currentYear: $currentYear
    ) {
      success
      message
      userId
      step
    }
  }
`;

export const REGISTER_TEACHER_STEP1 = gql`
  mutation RegisterTeacherStep1(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $subjects: [String!]
    $educationLevels: [EducationLevel!]
  ) {
    registerTeacherStep1(
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      subjects: $subjects
      educationLevels: $educationLevels
    ) {
      success
      message
      userId
      step
    }
  }
`;

export const REGISTER_STEP2 = gql`
  mutation RegisterStep2(
    $userId: ID!
    $email: String!
    $password: String!
    $confirmedPassword: String!
  ) {
    registerStep2(
      userId: $userId
      email: $email
      password: $password
      confirmedPassword: $confirmedPassword
    ) {
      success
      message
      userId
      step
    }
  }
`;

export const VERIFY_REGISTRATION_CODE = gql`
  mutation VerifyRegistrationCode($userId: ID!, $code: String!) {
    verifyRegistrationCode(userId: $userId, code: $code) {
      token
      user {
        id
        email
        firstName
        lastName
        role
        status
        verified
        studentProfile {
          id
          credit
          educationLevel
          currentYear
          parentName
        }
        teacherProfile {
          id
          credit
          totalEarnings
          withdrawable
          subjects
          educationLevels
        }
      }
    }
  }
`;

export const RESEND_VERIFICATION_CODE = gql`
  mutation ResendVerificationCode($userId: ID!) {
    resendVerificationCode(userId: $userId) {
      success
      message
    }
  }
`;

// ADMIN MUTATIONS
export const CREATE_ADMIN_MUTATION = gql`
  mutation CreateAdminUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $phone: String!
    $department: String
    $permissions: [String!]
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

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $phone: String
    $status: Status
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

// SUBJECT MUTATIONS
export const CREATE_SUBJECT_MUTATION = gql`
  mutation CreateSubject(
    $name: String!
    $description: String!
    $price: Float!
    $category: String
    $level: Level!
    $year: String
  ) {
    createSubject(
      name: $name
      description: $description
      price: $price
      category: $category
      level: $level
      year: $year
    ) {
      id
      name
      description
      price
      level
      year
      category
      status
      createdAt
    }
  }
`;

export const UPDATE_SUBJECT_MUTATION = gql`
  mutation UpdateSubject(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $level: Level
    $year: String
    $status: SubjectStatus
  ) {
    updateSubject(
      id: $id
      name: $name
      description: $description
      price: $price
      level: $level
      year: $year
      status: $status
    ) {
      id
      name
      description
      price
      level
      year
      status
    }
  }
`;

export const DELETE_SUBJECT_MUTATION = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`;

export const ASSIGN_TEACHER_MUTATION = gql`
  mutation AssignTeacherToSubject($subjectId: ID!, $teacherId: ID!) {
    assignTeacherToSubject(subjectId: $subjectId, teacherId: $teacherId) {
      id
      name
      assignedTeachers {
        teacherId
        assignedAt
        teacher {
          user {
            firstName
            lastName
          }
        }
      }
      stats {
        teachersCount
      }
    }
  }
`;

export const REMOVE_TEACHER_MUTATION = gql`
  mutation RemoveTeacherFromSubject($subjectId: ID!, $teacherId: ID!) {
    removeTeacherFromSubject(subjectId: $subjectId, teacherId: $teacherId) {
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

// STUDENT MUTATIONS
export const BUY_SUBJECT_MUTATION = gql`
  mutation BuySubject($subjectId: ID!) {
    buySubject(subjectId: $subjectId) {
      id
      amount
      type
      status
      description
      createdAt
    }
  }
`;

export const WATCH_VIDEO_MUTATION = gql`
  mutation WatchVideo($subjectId: ID!, $videoId: ID!) {
    watchVideo(subjectId: $subjectId, videoId: $videoId) {
      success
      message
      remainingCredit
      transaction {
        id
        amount
        teacherCut
        companyCut
        status
        description
      }
    }
  }
`;

export const UPDATE_VIDEO_PROGRESS_MUTATION = gql`
  mutation UpdateVideoProgress(
    $subjectId: ID!
    $videoId: ID!
    $watchedTime: Int!
    $lastPosition: Int!
  ) {
    updateVideoProgress(
      subjectId: $subjectId
      videoId: $videoId
      watchedTime: $watchedTime
      lastPosition: $lastPosition
    ) {
      id
      watchedTime
      completionPercentage
      completed
      lastPosition
      lastWatchedAt
    }
  }
`;

export const UPDATE_PDF_PROGRESS_MUTATION = gql`
  mutation UpdatePDFProgress(
    $subjectId: ID!
    $pdfId: ID!
    $pagesRead: [Int!]!
    $lastPage: Int!
  ) {
    updatePDFProgress(
      subjectId: $subjectId
      pdfId: $pdfId
      pagesRead: $pagesRead
      lastPage: $lastPage
    ) {
      id
      pagesRead
      lastPage
      completionPercentage
      completed
      lastReadAt
    }
  }
`;

export const UPDATE_STUDENT_PROFILE_MUTATION = gql`
  mutation UpdateStudentProfile(
    $currentYear: String
    $educationLevel: EducationLevel
    $parentName: String
  ) {
    updateStudentProfile(
      currentYear: $currentYear
      educationLevel: $educationLevel
      parentName: $parentName
    ) {
      id
      currentYear
      educationLevel
      parentName
      credit
    }
  }
`;

// TEACHER MUTATIONS
export const UPDATE_VIDEO_PRICE_MUTATION = gql`
  mutation UpdateVideoPrice(
    $subjectId: ID!
    $videoId: ID!
    $price: Float!
  ) {
    updateVideoPrice(
      subjectId: $subjectId
      videoId: $videoId
      price: $price
    ) {
      id
      name
      videos {
        id
        title
        price
      }
    }
  }
`;

export const REQUEST_WITHDRAWAL_MUTATION = gql`
  mutation RequestWithdrawal($amount: Float!) {
    requestWithdrawal(amount: $amount) {
      id
      amount
      type
      status
      description
      createdAt
    }
  }
`;

export const DELETE_VIDEO_MUTATION = gql`
  mutation DeleteVideo($subjectId: ID!, $videoId: ID!) {
    deleteVideo(subjectId: $subjectId, videoId: $videoId) {
      id
      name
      videos {
        id
        title
      }
      contentStats {
        totalVideos
      }
    }
  }
`;

export const DELETE_PDF_MUTATION = gql`
  mutation DeletePDF($subjectId: ID!, $pdfId: ID!) {
    deletePDF(subjectId: $subjectId, pdfId: $pdfId) {
      id
      name
      pdfs {
        id
        title
      }
      contentStats {
        totalPdfs
      }
    }
  }
`;

// RATINGS MUTATIONS
export const RATE_VIDEO_MUTATION = gql`
  mutation RateVideo(
    $subjectId: ID!
    $videoId: ID!
    $rating: Int!
    $comment: String
  ) {
    rateVideo(
      subjectId: $subjectId
      videoId: $videoId
      rating: $rating
      comment: $comment
    ) {
      id
      rating
      comment
      targetType
      createdAt
    }
  }
`;

export const RATE_SUBJECT_MUTATION = gql`
  mutation RateSubject(
    $subjectId: ID!
    $rating: Int!
    $comment: String
  ) {
    rateSubject(
      subjectId: $subjectId
      rating: $rating
      comment: $comment
    ) {
      id
      rating
      comment
      targetType
      createdAt
    }
  }
`;

export const RATE_TEACHER_MUTATION = gql`
  mutation RateTeacher(
    $teacherId: ID!
    $rating: Int!
    $comment: String
  ) {
    rateTeacher(
      teacherId: $teacherId
      rating: $rating
      comment: $comment
    ) {
      id
      rating
      comment
      targetType
      createdAt
    }
  }
`;

// MESSAGES MUTATIONS
export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage(
    $recipientId: ID!
    $subjectId: ID
    $content: String!
  ) {
    sendMessage(
      recipientId: $recipientId
      subjectId: $subjectId
      content: $content
    ) {
      id
      content
      isRead
      createdAt
      sender {
        id
        firstName
        lastName
      }
      recipient {
        id
        firstName
        lastName
      }
      subject {
        id
        name
      }
    }
  }
`;

export const MARK_MESSAGE_READ_MUTATION = gql`
  mutation MarkMessageAsRead($id: ID!) {
    markMessageAsRead(id: $id) {
      id
      isRead
    }
  }
`;

// PURCHASE POINTS
export const PURCHASE_POINTS_MUTATION = gql`
  mutation PurchasePoints($amount: Float!) {
    purchasePoints(amount: $amount) {
      id
      amount
      type
      status
      description
      createdAt
    }
  }
`;
