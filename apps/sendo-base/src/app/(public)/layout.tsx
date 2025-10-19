export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <aside className="relative hidden flex-1 flex-shrink basis-1/4 flex-col items-center justify-center xl:flex">
        <img
          src="/assets/bg-gradient-login.png"
          alt="Background Gradient Login"
          className="h-full w-full object-cover"
        />
      </aside>
      <main className="border-primary-1 flex flex-1 flex-shrink-0 flex-col items-center border-l bg-neutral-900 px-5 pt-16 pb-8 shadow-lg">
        {children}
      </main>
    </div>
  );
}
