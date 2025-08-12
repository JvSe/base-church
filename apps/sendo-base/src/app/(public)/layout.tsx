import Image from "next/image";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <aside className="hidden flex-1 flex-shrink basis-1/4 flex-col items-center justify-center xl:flex">
        <div className="font-roboto relative flex flex-col gap-6">
          <p className="z-10 max-w-lg text-3xl">
            &quot;Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry&apos;s
            standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 overflow-hidden rounded-full md:h-16 md:min-h-16 md:w-16 md:min-w-16">
              <Image
                src={`https://ui-avatars.com/api/?name=Joao+Vitor&background=random`}
                alt="img"
                width={100}
                height={100}
                className="h-full w-full"
              />
            </div>
            <div>
              <p className="font-roboto text-lg font-semibold">Joao Vitor</p>
              <p className="font-roboto gradient-text-yellow text-base font-medium">
                Aluno
              </p>
            </div>
          </div>
        </div>
      </aside>
      <main className="border-primary-1 flex flex-1 flex-shrink-0 flex-col items-center border-l bg-neutral-900 px-5 pt-16 pb-8 shadow-lg">
        {children}
      </main>
    </div>
  );
}
