"use client";
import {
  AutoScroll,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@repo/ui/components/carousel";
import { CourseCard } from "./course-card";
import { CoursesType } from "./sections/courses-section";

export const CourseSlides = ({ courses }: { courses: CoursesType[] }) => {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          speed: 0.3,
          startDelay: 0,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent className="px-4">
        {courses.map((c, index) => (
          <CarouselItem key={c.title + index}>
            <CourseCard
              title={c.title}
              teachers={c.teachers}
              variant={c.variant}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
