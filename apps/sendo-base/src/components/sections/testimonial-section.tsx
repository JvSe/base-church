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

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <div className="pb-40 pt-60 px-16 flex flex-col items-center w-dvw h-full">
        <div className="w-full h-full flex items-center flex-1 gap-5">
          <div className="flex-1 flex flex-col  gap-10 w-full h-full">
            <BorderContainerGradient>
              Depoimentos dos membros e alunos
            </BorderContainerGradient>
            <p className="font-belfast text-5xl font-semibold">
              Eles aprofundaram sua fé, cresceram em propósito e transformaram
              suas vidas em Cristo
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => api?.scrollPrev()}
                variant="clean"
                className="w-11 h-11 p-0 rounded-full bg-dark-2 flex items-center justify-center hover:scale-105 transition-all"
              >
                <ArrowLeft className="text-primary" />
              </Button>
              <Button
                onClick={() => api?.scrollNext()}
                variant="clean"
                className="w-11 h-11 p-0 rounded-full gradient-yellow flex items-center justify-center hover:scale-105 transition-all"
              >
                <ArrowRight className="text-primary " />
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full h-full">
            <CarouselContent>
              {comments.map((c, index) => (
                <CarouselItem key={c.user.name + index}>
                  <CommentCard comment={c.comment} user={c.user} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </div>
      </div>
    </Carousel>
  );
};
