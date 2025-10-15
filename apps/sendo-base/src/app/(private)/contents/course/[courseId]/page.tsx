import { CourseClientWrapper } from "./components";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default function CoursePage({ params }: CoursePageProps) {
  return <CourseClientWrapper params={params} />;
}
