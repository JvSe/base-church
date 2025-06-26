import Image from "next/image";
import { SpotlightCard } from "../spotlight-card";

export const PillarsSection = () => {
  return (
    <div
      id="section-pillars"
      className="w-full flex flex-col items-center gap-14 mb-20"
    >
      <div className="flex flex-col gap-5 items-center">
        <h1 className="font-surgena text-5xl font-bold">Pilares da Igreja</h1>

        <h2 className="text-center text-lg font-roboto">
          Vivemos a missão com Criatividade para comunicar, Multiplicação para{" "}
          <br />
          expandir e Provisão para sustentar o que Deus nos confiou.
        </h2>
      </div>

      <div>
        <div className="flex gap-7">
          <SpotlightCard className="max-w-96 text-center items-center bg-[#6D19F766]">
            <Image
              src="/assets/svg/creativity-icon.svg"
              alt="Sendo Base Logo"
              width={100}
              height={100}
              className="w-20 mx-auto mb-6"
            />
            <div className="flex-1">
              <p className="text-xl font-bold">Criatividade</p>
              <p className="font-roboto">
                Publish the course you want, in the way you want, and always
                have control of your own content.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard className="max-w-96 text-center gap-3 bg-[#3ED8E199]">
            <Image
              src="/assets/svg/provision-icon.svg"
              alt="Ícone de Provisão"
              width={100}
              height={100}
              className="w-20 mx-auto mb-6 "
            />
            <div className="flex-1">
              <p className="text-xl font-bold">Provisão</p>
              <p className="font-roboto">
                Publish the course you want, in the way you want, and always
                have control of your own content.
              </p>
            </div>
          </SpotlightCard>
          <SpotlightCard className="max-w-96 text-center bg-emerald-500">
            <Image
              src="/assets/svg/multiplication-icon.png"
              alt="Ícone de Provisão"
              width={100}
              height={100}
              className="w-20 mx-auto mb-6 invert"
            />
            <p className="text-xl font-bold">Multiplicação</p>
            <p className="font-roboto">
              Publish the course you want, in the way you want, and always have
              control of your own content.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
