import { gql } from '@apollo/client';

// AUTH
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      role
      status
    }
  }
`;

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    myProfile {
      ... on Student {
        id
        credit
        educationLevel
        currentYear
        parentName
        enrolledSubjects {
          id
          name
          level
          year
        }
      }
      ... on Teacher {
        id
        credit
        totalEarnings
        withdrawable
        subjects
        educationLevels
        selectedSubjects {
          id
          name
        }
        ratingsStats {
          averageRating
          totalRatings
        }
      }
      ... on Admin {
        id
        department
        permissions
        lastLogin
      }
    }
  }
`;

// STUDENTS
export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      user {
        id
        firstName
        lastName
        email
        phone
        status
        createdAt
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
        year
      }
      createdAt
    }
  }
`;

// TEACHERS
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
          level
          year
        }
        ratingsStats {
          averageRating
          totalRatings
        }
      }
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

// ADMINS
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

// SUBJECTS
export const GET_SUBJECTS = gql`
  query GetSubjects {
    subjects {
      id
      name
      description
      price
      category
      level
      year
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
        assignedAt
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
        enrolledAt
      }
      createdAt
    }
  }
`;

export const GET_SUBJECT = gql`
  query GetSubject($id: ID!) {
    subject(id: $id) {
      id
      name
      description
      price
      category
      level
      year
      status
      videos {
        id
        title
        description
        url
        duration
        fileSize
        format
        order
        price
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
        teacherId
        teacher {
          user {
            firstName
            lastName
          }
        }
        assignedAt
      }
      stats {
        totalSales
        revenue
        studentsEnrolled
        teachersCount
      }
      contentStats {
        totalVideos
        totalPdfs
      }
      createdAt
    }
  }
`;

export const GET_SUBJECTS_WITH_CONTENT = gql`
  query GetSubjectsWithContent {
    subjects {
      id
      name
      description
      price
      category
      level
      year
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
        price
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

// STUDENT QUERIES
export const GET_MY_SUBJECTS = gql`
  query GetMySubjects {
    mySubjects {
      hasEnrolled
      studentLevel
      studentYear
      enrolledSubjects {
        id
        name
        level
        year
        price
        category
        contentStats {
          totalVideos
          totalPdfs
        }
        videos {
          id
          title
          price
          duration
          url
          description
        }
        pdfs {
          id
          title
          pageCount
          url
          description
        }
        stats {
          studentsEnrolled
          totalSales
        }
      }
      availableSubjects {
        id
        name
        level
        year
        price
        category
        contentStats {
          totalVideos
          totalPdfs
        }
      }
    }
  }
`;

export const HAS_ACCESS_TO_VIDEO = gql`
  query HasAccessToVideo($subjectId: ID!, $videoId: ID!) {
    hasAccessToVideo(subjectId: $subjectId, videoId: $videoId)
  }
`;

export const GET_MY_PROGRESS = gql`
  query GetMyProgress {
    myProgress {
      subject {
        id
        name
        level
        year
      }
      overallProgress
      videosProgress {
        id
        videoId
        watchedTime
        completionPercentage
        completed
        lastPosition
        lastWatchedAt
      }
      pdfsProgress {
        id
        pdfId
        pagesRead
        lastPage
        completionPercentage
        completed
        lastReadAt
      }
      ratings {
        id
        rating
        comment
        targetType
        createdAt
      }
    }
  }
`;

// TRANSACTIONS
export const GET_MY_TRANSACTIONS = gql`
  query GetMyTransactions {
    myTransactions {
      id
      amount
      type
      teacherCut
      companyCut
      status
      description
      videoId
      createdAt
      subject {
        id
        name
      }
    }
  }
`;

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions($type: TransactionType) {
    allTransactions(type: $type) {
      id
      amount
      type
      teacherCut
      companyCut
      status
      description
      videoId
      createdAt
      subject {
        id
        name
      }
      student {
        id
        firstName
        lastName
        email
      }
      teacher {
        id
        firstName
        lastName
      }
    }
  }
`;

// DASHBOARD STATS
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalStudents
      totalTeachers
      totalSubjects
      totalRevenue
      totalTransactions
      recentTransactions {
        id
        amount
        type
        status
        description
        createdAt
        subject {
          name
        }
      }
    }
  }
`;

// DASHBOARD KPIs
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

// STUDENT ANALYTICS
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

// MESSAGES
export const GET_MY_MESSAGES = gql`
  query GetMyMessages($recipientId: ID) {
    myMessages(recipientId: $recipientId) {
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

export const GET_CONVERSATION = gql`
  query GetConversation($userId: ID!) {
    conversation(userId: $userId) {
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
    }
  }
`;

// RATINGS
export const GET_SUBJECT_RATINGS = gql`
  query GetSubjectRatings($subjectId: ID!) {
    subjectRatings(subjectId: $subjectId) {
      id
      rating
      comment
      targetType
      createdAt
      student {
        user {
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_TEACHER_RATINGS = gql`
  query GetTeacherRatings($teacherId: ID!) {
    teacherRatings(teacherId: $teacherId) {
      id
      rating
      comment
      targetType
      createdAt
      student {
        user {
          firstName
          lastName
        }
      }
    }
  }
`;

// MEMORY SESSIONS
export const GET_MY_MEMORY_SESSIONS = gql`
  query GetMyMemorySessions(
    $status: MemorySessionStatus
    $limit: Int
    $offset: Int
  ) {
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
