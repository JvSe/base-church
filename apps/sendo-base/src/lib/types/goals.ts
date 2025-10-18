export type UserGoal = {
  id: string;
  userId: string;
  dailyStudyHours: number;
  monthlyCoursesTarget: number;
  weeklyStudyHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GoalEstimates = {
  dailyHours: number;
  weeklyHours: number;
  monthlyHours: number;
  estimatedCoursesPerMonth: number;
  estimatedDaysToCompleteCourse: number;
};

export type CreateGoalData = {
  dailyStudyHours: number;
};

export type UpdateGoalData = {
  dailyStudyHours?: number;
  monthlyCoursesTarget?: number;
};
