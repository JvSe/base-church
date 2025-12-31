export * from "./auth";
export * from "./certificate";
export * from "./course";
export * from "./dashboard";
export * from "./enrollment";
export * from "./event";
export * from "./event-certificate";
export * from "./event-certificate-public";
export * from "./goals";
export * from "./help";
export * from "./invite";
export * from "./invite-helpers";
export * from "./password-reset";
export * from "./question";
export * from "./tracks";
export * from "./user";
// Export community actions - rename conflicting functions (getEvents, getEventById)
// and export all other functions normally
export {
  getCommunityEvents,
  getCommunityEventById,
  enrollInEvent,
  getForumPosts,
  getForumPostById,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  createForumComment,
  updateForumComment,
  deleteForumComment,
  toggleForumPostLike,
  registerForumPostView,
  createCourseReview,
  createEventReview,
  unlockAchievement,
  getCommunityData,
  getNotifications,
  markNotificationAsRead,
  searchContent,
} from "./community";
