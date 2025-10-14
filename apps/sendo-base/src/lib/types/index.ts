// ============================================================================
// TYPES CENTRALIZADOS DO PROJETO
// ============================================================================
// Este arquivo contém todos os types compartilhados do projeto
// Seguindo a convenção: usar 'type' ao invés de 'interface'

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string | ApiError };

// Alias para compatibilidade com código existente
export type ActionResponse<T> =
  | ({ success: true; data?: T; message?: string } & T)
  | { success: false; error: string };

// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = "MEMBROS" | "LIDER" | "ADMIN";
export type UserApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  cpf: string | null;
  role: UserRole;
  isPastor: boolean;
  image: string | null;
  approvalStatus: UserApprovalStatus;
  bio: string | null;
  phone: string | null;
  birthDate: Date | null;
  joinDate: Date;
  profileCompletion: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRelations = User & {
  enrollments?: Enrollment[];
  certificates?: Certificate[];
  achievements?: UserAchievement[];
  stats?: UserStats;
};

// ============================================================================
// COURSE TYPES
// ============================================================================

export type CourseCategory = "CREATIVITY" | "PROVISION" | "MULTIPLICATION";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived";

export type Course = {
  id: string;
  title: string;
  description: string | null;
  longDescription: string | null;
  slug: string;
  image: string | null;
  duration: number | null;
  level: string | null;
  category: string | null;
  instructorId: string | null;
  price: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  totalLessons: number;
  isFeatured: boolean;
  isPublished: boolean;
  certificate: boolean;
  tags: string[];
  objectives: string[];
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CourseWithInstructor = Course & {
  instructor: {
    id: string;
    name: string | null;
    image: string | null;
    bio?: string | null;
    role?: UserRole;
  } | null;
};

export type CourseWithModules = CourseWithInstructor & {
  modules: ModuleWithLessons[];
  _count?: {
    enrollments: number;
    reviews?: number;
  };
  reviews?: CourseReview[];
};

export type CourseFormData = {
  title: string;
  description: string;
  instructorId: string;
  duration: number;
  level: string;
  status: string;
  price: number;
  category: string;
  tags: string;
};

// ============================================================================
// MODULE & LESSON TYPES
// ============================================================================

export type LessonType =
  | "VIDEO"
  | "TEXT"
  | "OBJECTIVE_QUIZ"
  | "SUBJECTIVE_QUIZ";

export type Module = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  courseId: string;
  requiresActivityCompletion: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Lesson = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  youtubeEmbedId: string | null;
  duration: number | null;
  order: number;
  moduleId: string;
  type: LessonType;
  isActivity: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ModuleWithLessons = Module & {
  lessons: Lesson[];
};

export type LessonWithProgress = Lesson & {
  isCompleted: boolean;
  isWatched: boolean;
  isLocked?: boolean;
  progress?: LessonProgress[];
};

export type LessonFormData = {
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  youtubeEmbedId?: string;
  duration: number;
  order: number;
  type: LessonType;
  isActivity?: boolean;
};

// ============================================================================
// ENROLLMENT TYPES
// ============================================================================

export type EnrollmentStatus = "pending" | "approved" | "rejected";

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt: Date | null;
  progress: number;
  completedLessons: number;
  lastAccessedAt: Date | null;
  status: EnrollmentStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EnrollmentWithCourse = Enrollment & {
  course: CourseWithInstructor;
};

// ============================================================================
// PROGRESS TYPES
// ============================================================================

export type LessonProgress = {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  watchedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

export type CertificateStatus = "PENDING" | "ISSUED" | "REVOKED";

export type Certificate = {
  id: string;
  userId: string;
  courseId: string;
  templateId: string;
  verificationCode: string;
  status: CertificateStatus;
  issuedAt: Date | null;
  revokedAt: Date | null;
  revokedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CertificateWithRelations = Certificate & {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  course: {
    id: string;
    title: string;
  };
  template: CertificateTemplate;
};

export type CertificateTemplate = {
  id: string;
  name: string;
  description: string | null;
  templateHtml: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================================================
// REVIEW TYPES
// ============================================================================

export type CourseReview = {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseReviewWithUser = CourseReview & {
  user: {
    id: string;
    name: string | null;
    role: UserRole;
  };
};

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  createdAt: Date;
};

export type UserAchievement = {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
  achievement?: Achievement;
};

// ============================================================================
// STATS TYPES
// ============================================================================

export type UserStats = {
  id: string;
  userId: string;
  coursesCompleted: number;
  totalStudyTime: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
  hoursStudied?: number;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | "ENROLLMENT_APPROVED"
  | "ENROLLMENT_REJECTED"
  | "COURSE_COMPLETED"
  | "CERTIFICATE_ISSUED"
  | "NEW_COURSE"
  | "NEW_EVENT"
  | "GENERAL";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: Date;
};

export type NotificationData = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string | null;
  metadata?: {
    courseId?: string;
    enrollmentId?: string;
    certificateId?: string;
  };
};

// ============================================================================
// EVENT TYPES
// ============================================================================

export type Event = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean;
  maxParticipants: number | null;
  instructorId: string | null;
  image: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type EventWithInstructor = Event & {
  instructor: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};

// ============================================================================
// QUESTION & ANSWER TYPES (para atividades)
// ============================================================================

export type QuestionType = "OBJECTIVE" | "SUBJECTIVE";
export type SubjectiveAnswerType = "TEXT" | "FILE";
export type AnswerStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_REVISION";

export type Question = {
  id: string;
  lessonId: string;
  type: QuestionType;
  questionText: string;
  points: number;
  order: number;
  correctAnswer: string | null;
  explanation: string | null;
  subjectiveAnswerType: SubjectiveAnswerType | null;
  createdAt: Date;
  updatedAt: Date;
};

export type QuestionOption = {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
};

export type StudentAnswer = {
  id: string;
  userId: string;
  questionId: string;
  answerText: string | null;
  fileUrl: string | null;
  status: AnswerStatus;
  score: number | null;
  feedback: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
};

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export type Teacher = {
  name: string;
  avatar_url: string;
  description: string;
  prefix: "PRA." | "PR.";
};

export type CategoryInfo = {
  value: string;
  label: string;
  icon: string;
  description: string;
};

// ============================================================================
// FORM TYPES
// ============================================================================

export type SearchFilters = {
  query?: string;
  category?: string;
  level?: string;
  tags?: string[];
};

export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
