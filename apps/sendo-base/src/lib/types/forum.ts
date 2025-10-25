export type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  isPublished: boolean;
  likesCount: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    isPastor: boolean;
  };
  _count: {
    comments: number;
  };
  isLikedByUser?: boolean; // Flag para saber se o usuário atual curtiu
};

export type ForumPostWithEngagement = ForumPost & {
  likes: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isSolved: boolean;
};

export type ForumCategory = {
  id: string;
  name: string;
  count: number;
};

export type CreatePostData = {
  title: string;
  content: string;
  category?: string;
};

export type ForumFilters = {
  search: string;
  category: string;
  sortBy: "all" | "trending" | "recent" | "solved" | "unsolved";
};

export type ForumComment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    isPastor: boolean;
  };
};

export type ForumPostWithComments = ForumPost & {
  comments: ForumComment[];
};

export type CreateCommentData = {
  content: string;
  postId: string;
};
