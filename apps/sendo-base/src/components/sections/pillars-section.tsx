import Image from "next/image";
import { SpotlightCard } from "../spotlight-card";

export const PillarsSection = () => {
  return (
    <div
      id="section-pillars"
      className="mb-20 flex w-full flex-col items-center gap-14"
    >
      <div className="flex flex-col items-center gap-2 md:gap-5">
        <h1 className="font-surgena text-4xl font-bold md:text-5xl">
          Pilares da Igreja
        </h1>

        <h2 className="font-roboto mx-4 text-center text-base md:text-lg">
          Vivemos a missão com Criatividade para comunicar, Multiplicação para
          expandir e Provisão para sustentar o que Deus nos confiou.
        </h2>
      </div>

      <div>
        <div className="flex w-full flex-col items-center gap-4 px-4 md:flex-row md:gap-7">
          <SpotlightCard className="flex w-full flex-col items-center justify-center gap-3 bg-[#6D19F766] text-center md:max-w-96">
            <Image
              src="/assets/svg/creativity-icon.svg"
              alt="Sendo Base Logo"
              width={100}
              height={100}
              className="mx-auto mb-3 w-20"
            />
            <p className="text-xl font-bold">Criatividade</p>
          </SpotlightCard>
          <SpotlightCard className="flex w-full flex-col items-center justify-center gap-3 bg-[#3ED8E199] text-center md:max-w-96">
            <Image
              src="/assets/svg/provision-icon.svg"
              alt="Ícone de Provisão"
              width={100}
              height={100}
              className="mx-auto mb-3 w-20"
            />
            <p className="text-xl font-bold">Provisão</p>
          </SpotlightCard>
          <SpotlightCard className="flex w-full flex-col items-center justify-center gap-3 bg-emerald-500 text-center md:max-w-96">
            <Image
              src="/assets/svg/multiplication-icon.png"
              alt="Ícone de Provisão"
              width={100}
              height={100}
              className="mx-auto mb-3 w-20 invert"
            />
            <p className="text-xl font-bold">Multiplicação</p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
