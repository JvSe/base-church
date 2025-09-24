"use client";
import { Teacher } from "@/src/lib/types";
import {
    AutoScroll,
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@base-church/ui/components/carousel";
import { cn } from "@base-church/ui/lib/utils";
import { TeacherCard } from "../teacher-card";

export const TeachersSection = () => {
  const teachers: Teacher[] = [
    {
      name: "Robson Correa",
      avatar_url: "https://avatar.iran.liara.run/public/boy",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Jefferson Leal",
      avatar_url: "https://avatar.iran.liara.run/public/boy",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Patrick Nascimento",
      avatar_url: "https://avatar.iran.liara.run/public/boy",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Robson Correa",
      avatar_url: "https://avatar.iran.liara.run/public/boy",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Jefferson Leal",
      avatar_url: "https://avatar.iran.liara.run/public/boy",
      description: "description",
      prefix: "PR.",
    },
    {
      name: "Patrick Nascimento",
      avatar_url: "https://avatar.iran.liara.run/public/boy",
      description: "description",
      prefix: "PR.",
    },
  ];

  return (
    <div
      id="section-teachers"
      className="relative flex min-h-full w-dvw flex-col items-center pt-12 md:pt-24"
    >
      <h1 className="font-surgena mb-10 text-4xl font-bold md:mb-20 md:text-5xl">
        Nossos Professores
      </h1>

      <div className="h-full w-full gap-5 py-1">
        <Carousel
          opts={{ loop: true, align: "center" }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 0.3,
              startDelay: 0,
              stopOnInteraction: false,
              direction: "backward",
            }),
          ]}
        >
          <CarouselContent className="items-center px-4">
            {teachers.map((t, index) => (
              <CarouselItem
                className={cn("basis-full md:basis-md")}
                key={t.name + index}
              >
                <TeacherCard key={t.name + index} teacher={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
