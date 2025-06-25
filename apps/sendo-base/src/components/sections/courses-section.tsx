export const CourseSection = () => {
  return (
    <div className="relative flex flex-col items-center w-dvw min-h-dvh">
      <h1 className="font-surgena font-bold text-5xl">Conheça nossos Cursos</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(424px,1fr))]  w-full h-full px-16 gap-5">
        <div className="bg-emerald-500 py-5 px-4 items-center rounded-lg flex flex-col h-[429px] w-full">
          <div className="flex-1 w-full h-full bg-primary rounded-xl"></div>
          <div className="w-full flex-[0.4] mt-4">
            <h1 className="text-2xl font-semibold">Sendo Base</h1>

            <div className="flex gap-4 items-center">
              <div className="w-12  h-12 rounded-lg bg-red-100"></div>
              <div className="w-12 h-12 -ml-8 rounded-lg bg-green-100"></div>
              <div className="w-12 h-12 -ml-8 rounded-lg bg-yellow-100"></div>

              <p className="font-roboto text-xl">Prs. Robson, Jeff, Patrick</p>
            </div>
          </div>
        </div>
        <div className="bg-[#3ED8E199] py-5 px-4 items-center rounded-lg flex flex-col h-[429px] w-full">
          <div className="flex-1 w-full h-full bg-primary rounded-xl"></div>
          <div className="w-full flex-[0.4] mt-4">
            <h1 className="text-2xl font-semibold">Sendo Base</h1>

            <div className="flex gap-4 items-center">
              <div className="w-12  h-12 rounded-lg bg-red-100"></div>
              <div className="w-12 h-12 -ml-8 rounded-lg bg-green-100"></div>
              <div className="w-12 h-12 -ml-8 rounded-lg bg-yellow-100"></div>

              <p className="font-roboto text-xl">Prs. Robson, Jeff, Patrick</p>
            </div>
          </div>
        </div>
        <div className="bg-[#6D19F766] py-5 px-4 items-center rounded-lg flex flex-col h-[429px] w-full">
          <div className="flex-1 w-full h-full bg-primary rounded-xl"></div>
          <div className="w-full flex-[0.4] mt-4">
            <h1 className="text-2xl font-semibold">Sendo Base</h1>

            <div className="flex gap-4 items-center">
              <div className="w-12  h-12 rounded-lg bg-red-100"></div>
              <div className="w-12 h-12 -ml-8 rounded-lg bg-green-100"></div>
              <div className="w-12 h-12 -ml-8 rounded-lg bg-yellow-100"></div>

              <p className="font-roboto text-xl">Prs. Robson, Jeff, Patrick</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
