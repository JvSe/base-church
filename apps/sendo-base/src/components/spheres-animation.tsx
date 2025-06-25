export const SpheresAnimation = () => {
  return (
    <div className="relative w-full h-full bg-[#0f0f1a] overflow-hidden">
      <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-[#8f00ff] blur-[80px] opacity-60 animate-float"></div>
      <div className="absolute top-[50%] left-[60%] w-[250px] h-[250px] rounded-full bg-[#00fff0] blur-[80px] opacity-60 animate-float delay-[2000ms]"></div>
      <div className="absolute top-[30%] left-[75%] w-[200px] h-[200px] rounded-full bg-[#ff007a] blur-[80px] opacity-60 animate-float delay-[4000ms]"></div>
    </div>
  );
};
