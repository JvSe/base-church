import { Button } from "@base-church/ui/components/button";
import Image from "next/image";
import Particles from "../particles";

export const SectionHero = () => {
  return (
    <div
      id="section-hero"
      className="relative h-full w-dvw md:min-h-[calc(100dvh-12dvh)]"
    >
      <Image
        src="/assets/svg/hero-circle.svg"
        alt="Sendo Base Logo"
        width={100}
        height={100}
        className="absolute inset-x-0 top-[calc(1/3*120%)] h-full w-full scale-120 md:top-1/4"
      />
      <Image
        src="/assets/svg/mask-clean.svg"
        alt="Sendo Base Logo"
        width={100}
        height={100}
        className="absolute -top-0 h-full w-full object-cover select-none"
      />

      <div className="relative h-[500px] w-full md:h-[800px]">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={1000}
          particleSpread={30}
          speed={0.4}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={true}
        />
      </div>

      <div className="absolute inset-0 mt-36 flex flex-col items-center gap-6 md:mt-50 md:gap-12">
        <div className="flex items-center justify-center gap-4">
          <div className="relative -mt-12 scale-60">
            <Image
              src="/assets/svg/logo/logo-b.svg"
              alt="Sendo Base Logo"
              width={200}
              height={200}
              className="h-20 w-20 scale-50"
            />
            <Image
              src="/assets/svg/logo/logo-circle.svg"
              alt="Sendo Base Logo"
              width={200}
              height={200}
              className="animate-spin-slow absolute top-0 h-20 w-20"
            />
          </div>
          {/* 
          <div className="border h-min px-8 py-2 rounded-lg border-dark-2">
            <p className="text-xl font-bold gradient-text-dark">
              Base Church, uma família para sempre!
            </p>
          </div> */}
        </div>
        <div className="text-center">
          <h1 className="font-surgena text-[42px] font-bold md:text-8xl 2xl:text-9xl">
            Formando Líderes
          </h1>
          <h2 className="font-roboto text-[30px] italic md:text-6xl 2xl:text-7xl">
            Influentes e Relevantes
          </h2>
        </div>

        <Button
          size="clean"
          className="gradient-yellow font-surgena text-primary mt-5 rounded-xl px-7 py-4 text-lg font-bold uppercase md:px-11"
        >
          Quero Iniciar Meus Estudos
        </Button>
      </div>
    </div>
  );
};
