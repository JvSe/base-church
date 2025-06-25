import { Button } from "@repo/ui/components/button";
import Image from "next/image";
import Particles from "../particles";

export const SectionHero = () => {
  return (
    <div className="relative w-dvw min-h-dvh">
      <Image
        src="/assets/svg/hero-circle.svg"
        alt="Sendo Base Logo"
        width={100}
        height={100}
        className="w-full h-full inset-x-0 top-1/4 absolute scale-120"
      />
      <Image
        src="/assets/svg/mask-clean.svg"
        alt="Sendo Base Logo"
        width={100}
        height={100}
        className="absolute -top-0 w-full h-full object-cover select-none"
      />

      <div className="relative w-full h-[800px]">
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

      <div className="absolute inset-0 flex-col flex items-center gap-12 mt-50">
        <div className="flex items-center gap-4 justify-center">
          <div className="relative scale-60 -mt-12">
            <Image
              src="/assets/svg/logo/logo-b.svg"
              alt="Sendo Base Logo"
              width={200}
              height={200}
              className="w-20 h-20 scale-50"
            />
            <Image
              src="/assets/svg/logo/logo-circle.svg"
              alt="Sendo Base Logo"
              width={200}
              height={200}
              className="w-20 h-20 absolute top-0 animate-spin-slow"
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
          <h1 className="font-surgena font-bold md:text-8xl 2xl:text-9xl">
            Formando Líderes
          </h1>
          <h2 className="font-roboto italic md:text-6xl 2xl:text-7xl">
            Influentes e Relevantes
          </h2>
        </div>

        <Button
          size="clean"
          className="gradient-yellow font-surgena text-lg mt-10 text-primary uppercase font-bold py-4 px-11 rounded-xl"
        >
          Quero Iniciar Meus Estudos
        </Button>
      </div>
    </div>
  );
};
