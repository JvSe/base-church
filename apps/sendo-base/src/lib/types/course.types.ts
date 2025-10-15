/**
 * Types para Sistema de Cursos
 *
 * Centralizados para evitar duplicação e inconsistências
 * Antes: Duplicados em 5+ arquivos (~120 linhas duplicadas)
 * Depois: Arquivo único (~60 linhas)
 */

// ========================================
// LESSON TYPES
// ========================================

export type LessonType =
  | "VIDEO"
  | "TEXT"
  | "OBJECTIVE_QUIZ"
  | "SUBJECTIVE_QUIZ";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  youtubeEmbedId?: string;
  duration: number;
  order: number;
  type: LessonType;
  isActivity?: boolean;
  questions?: Question[];
};

// ========================================
// MODULE TYPES
// ========================================

export type Module = {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
};

// ========================================
// QUESTION TYPES
// ========================================

export type QuestionType = "objective" | "subjective";
export type SubjectiveAnswerType = "text" | "file";

export type QuestionOption = {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
};

export type Question = {
  id?: string;
  questionText: string;
  points: number;
  order: number;
  explanation?: string;
  type: QuestionType;
  subjectiveAnswerType?: SubjectiveAnswerType;
  correctAnswer?: string;
  options?: QuestionOption[];
};

// ========================================
// COURSE TYPES
// ========================================

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived";

export type DashboardCourse = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: CourseLevel;
  status: CourseStatus;
  studentsEnrolled: number;
  studentsCompleted: number;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  category: string;
  tags: string[];
};

// ========================================
// CERTIFICATE TYPES
// ========================================

export type CertificateTemplate = {
  id: string;
  title: string;
  description: string;
  templateUrl?: string;
  isActive: boolean;
};
