import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@base-church/ui/components/accordion";
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
    <div className="relative flex min-h-full w-dvw flex-col items-center pt-5 pb-10 md:pt-10 md:pb-20">
      <BorderContainerGradient>
        Ficou com alguma dúvida?
      </BorderContainerGradient>
      <h1 className="font-surgena mt-10 mb-10 text-4xl font-bold md:mt-14 md:mb-20 md:text-5xl">
        Dúvidas Frequentes
      </h1>

      <div className="flex h-full w-full px-4 md:px-52">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionQuestionItem
            value="item-1"
            trigger="1. O que é a plataforma de estudos da Base Church?"
            text="É uma plataforma de cursos online criada para formar líderes influentes e relevantes que impactam a igreja e o mundo. Nossa missão é estabelecer uma cultura de crescimento contínuo, com conteúdos que fortalecem a fé e capacitam pessoas para viverem o evangelho com propósito.
"
          />
          <AccordionQuestionItem
            value="item-2"
            trigger="2. ⁠Para quem é essa plataforma?"
            text="Para todos da Base que desejam crescer: novos convertidos, voluntários, líderes de ministério, discipuladores e também membros que querem aprofundar sua caminhada com Cristo. Se você faz parte da igreja, essa plataforma é pra você."
          />
          <AccordionQuestionItem
            value="item-3"
            trigger="3.⁠ ⁠Como funciona o acesso aos cursos?"
            text="Basta fazer login na plataforma. Ao acessar, você pode iniciar os cursos conforme a sua necessidade ou seguir a trilha recomendada pela sua liderança. Seu progresso é salvo automaticamente e você pode estudar no seu ritmo."
          />
          <AccordionQuestionItem
            value="item-4"
            trigger="4.⁠ ⁠Tem certificado?"
            text="Sim. Algumas trilhas oferecem certificados internos que reconhecem sua jornada de aprendizado e podem ser usados como pré-requisito para servir ou liderar dentro da igreja.
"
          />
          <AccordionQuestionItem
            value="item-5"
            trigger="5.⁠ ⁠Os cursos são gratuitos?
"
            text="Sim! A maior parte do conteúdo é 100% gratuito, pois acreditamos que a formação espiritual deve ser acessível a todos que desejam crescer no Reino de Deus. No entanto, futuramente poderão ser lançados alguns cursos com acesso fechado ou exclusivo, voltados para formações específicas.
"
          />
          <AccordionQuestionItem
            value="item-6"
            trigger="6. ⁠⁠E se eu tiver dúvidas?"
            text="Você pode entrar em contato com a liderança do seu ministério, discipulador ou enviar sua pergunta pelo botão de suporte na plataforma. Estamos aqui para caminhar com você.
"
          />
        </Accordion>
      </div>
    </div>
  );
};
