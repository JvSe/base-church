// Course Categories Configuration
export const COURSE_CATEGORIES = [
  {
    value: "CREATIVITY",
    label: "Criatividade",
    description: "Cursos focados em criatividade e inovação ministerial",
    icon: "🎨",
  },
  {
    value: "PROVISION",
    label: "Provisão",
    description: "Cursos sobre provisão divina e recursos ministeriais",
    icon: "💎",
  },
  {
    value: "MULTIPLICATION",
    label: "Multiplicação",
    description: "Cursos sobre multiplicação e crescimento ministerial",
    icon: "🌱",
  },
] as const;

// Helper function to get category info
export function getCategoryInfo(category: string) {
  return (
    COURSE_CATEGORIES.find((cat) => cat.value === category) ||
    COURSE_CATEGORIES[0]
  );
}

// Helper function to get category label
export function getCategoryLabel(category: string): string {
  return getCategoryInfo(category).label;
}

// Helper function to get category icon
export function getCategoryIcon(category: string): string {
  return getCategoryInfo(category).icon;
}

// Helper function to get category description
export function getCategoryDescription(category: string): string {
  return getCategoryInfo(category).description;
}
