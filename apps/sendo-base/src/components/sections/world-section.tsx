import Image from "next/image";

export const WorldSection = () => {
  return (
    <div className="relative flex w-full items-center justify-center px-4 pb-10 md:py-20">
      <div className="flex w-full items-center rounded-xl bg-[#1E1E1E] px-4 py-12 md:h-[455px] md:w-10/12 md:px-16">
        <h1 className="font-belfast text-center text-2xl font-black md:text-left md:text-4xl">
          O nosso objetivo é estabelecer uma cultura de crescimento, formando
          líderes influentes e relevantes para impactar a igreja e o mundo
        </h1>

        <Image
          src="/assets/svg/gradient.svg"
          alt="Sendo Base Logo"
          width={100}
          height={100}
          className="hidden w-[445px] lg:block"
        />
      </div>

      <Image
        src="/assets/svg/world-map.svg"
        alt="Sendo Base Logo"
        width={100}
        height={100}
        className="absolute inset-0 top-10 -z-10 w-full scale-150 md:top-30"
      />
    </div>
  );
};
