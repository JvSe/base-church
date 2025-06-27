"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { CommentCard } from "../comment-card";

import { Button } from "@repo/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@repo/ui/components/carousel";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";
import { BorderContainerGradient } from "../border-container-gradient";

export const TestimonialSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const comments = [
    {
      comment: ` Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type.`,
      user: {
        name: "João Vitor",
        description: "Membro da Base Church",
      },
    },
    {
      comment: ` Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type.`,
      user: {
        name: "Sara Nunes",
        description: "Membro da Base Church",
      },
    },
  ];

  useEffect(() => {
    if (!api) return;
  }, [api]);

  const SlidesButton = ({ className }: { className?: string }) => (
    <div className={cn("flex gap-3", className)}>
      <Button
        onClick={() => api?.scrollPrev()}
        variant="clean"
        className="bg-dark-2 flex h-11 w-11 items-center justify-center rounded-full p-0 transition-all hover:scale-105"
      >
        <ArrowLeft className="text-primary" />
      </Button>
      <Button
        onClick={() => api?.scrollNext()}
        variant="clean"
        className="gradient-yellow flex h-11 w-11 items-center justify-center rounded-full p-0 transition-all hover:scale-105"
      >
        <ArrowRight className="text-primary" />
      </Button>
    </div>
  );

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <div className="flex h-full w-dvw flex-col items-center px-4 pt-20 pb-10 md:px-16 md:pt-60 md:pb-40">
        <div className="flex h-full w-full flex-1 flex-col items-center gap-5 md:flex-row">
          <div className="flex h-full w-full flex-1 flex-col items-center gap-8 md:items-start md:gap-10">
            <BorderContainerGradient>
              Depoimentos dos membros e alunos
            </BorderContainerGradient>
            <p className="font-belfast text-center text-2xl font-semibold md:text-left md:text-5xl">
              Eles aprofundaram sua fé, cresceram em propósito e transformaram
              suas vidas em Cristo
            </p>
            <SlidesButton className="hidden md:block" />
          </div>
          <div className="h-full w-full flex-1">
            <CarouselContent>
              {comments.map((c, index) => (
                <CarouselItem key={c.user.name + index}>
                  <CommentCard comment={c.comment} user={c.user} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <SlidesButton className="mx-auto mt-6 w-min md:hidden" />
          </div>
        </div>
      </div>
    </Carousel>
  );
};
