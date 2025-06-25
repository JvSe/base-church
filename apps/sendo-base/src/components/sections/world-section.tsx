import Image from "next/image";

export const WorldSection = () => {
  return (
    <div className="w-full flex items-center justify-center relative py-20">
      <div className="w-10/12 bg-[#1E1E1E] items-center px-16 h-[455px] flex rounded-xl">
        <h1 className="font-belfast font-black text-4xl">
          O nosso objetivo é estabelecer uma cultura de crescimento, formando
          líderes influentes e relevantes para impactar a igreja e o mundo
        </h1>

        <Image
          src="/assets/svg/gradient.svg"
          alt="Sendo Base Logo"
          width={100}
          height={100}
          className="w-[445px]"
        />
      </div>

      <Image
        src="/assets/svg/world-map.svg"
        alt="Sendo Base Logo"
        width={100}
        height={100}
        className="w-full absolute inset-0 scale-150 top-30 -z-10"
      />
    </div>
  );
};
