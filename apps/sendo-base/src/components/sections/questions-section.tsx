import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { BorderContainerGradient } from "../border-container-gradient";

const AccordionQuestionItem = ({
  value,
  text,
  trigger,
}: {
  value: string;
  trigger: string;
  text: string;
}) => {
  return (
    <AccordionItem className="mb-5" value={value}>
      <AccordionTrigger className="font-belfast text-xl">
        {trigger}
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-base">{text}</p>
      </AccordionContent>
    </AccordionItem>
  );
};

export const QuestionsSection = () => {
  return (
    <div className="relative flex pt-10 pb-20 flex-col items-center w-dvw min-h-full">
      <BorderContainerGradient>
        Ficou com alguma dúvida?
      </BorderContainerGradient>
      <h1 className="font-surgena mt-14 font-bold text-5xl mb-20">
        Dúvidas Frequentes
      </h1>

      <div className="flex w-full h-full px-52">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionQuestionItem
            value="item-1"
            trigger="Pergunta recente número 1?"
            text="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type."
          />
          <AccordionQuestionItem
            value="item-2"
            trigger="Pergunta recente número 2?"
            text="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type."
          />
          <AccordionQuestionItem
            value="item-3"
            trigger="Pergunta recente número 3?"
            text="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type."
          />
          <AccordionQuestionItem
            value="item-4"
            trigger="Pergunta recente número 4?"
            text="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type."
          />
          <AccordionQuestionItem
            value="item-5"
            trigger="Pergunta recente número 5?"
            text="Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type."
          />
        </Accordion>
      </div>
    </div>
  );
};
