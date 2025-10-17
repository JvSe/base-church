export type HelpCategory = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  bgColor: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type HelpQuestion = {
  id: string;
  categoryId: string;
  question: string;
  answer: string | null;
  order: number;
  isActive: boolean;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
};

export type HelpCategoryWithQuestions = HelpCategory & {
  questions: HelpQuestion[];
};

export type HelpArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  excerpt: string | null;
  views: number;
  helpful: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    feedbacks: number;
  };
};

export type SupportOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  contactInfo: string | null;
  responseTime: string;
  isAvailable: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type HelpStats = {
  satisfaction: number;
  avgResponseTime: string;
  availability: string;
};

export type CategoryWithCount = {
  name: string;
  count: number;
};
