// Média de horas por curso (baseado em cursos típicos)
const AVERAGE_COURSE_HOURS = 20;

// Calculate goal estimates based on daily study hours
export function calculateGoalEstimates(dailyStudyHours: number) {
  const weeklyHours = dailyStudyHours * 7;
  const monthlyHours = dailyStudyHours * 30;

  // Estima quantos cursos podem ser completados por mês
  const estimatedCoursesPerMonth = Math.floor(
    monthlyHours / AVERAGE_COURSE_HOURS,
  );

  // Estima quantos dias para completar 1 curso
  const estimatedDaysToCompleteCourse = Math.ceil(
    AVERAGE_COURSE_HOURS / dailyStudyHours,
  );

  return {
    dailyHours: dailyStudyHours,
    weeklyHours,
    monthlyHours,
    estimatedCoursesPerMonth: Math.max(1, estimatedCoursesPerMonth),
    estimatedDaysToCompleteCourse,
  };
}
