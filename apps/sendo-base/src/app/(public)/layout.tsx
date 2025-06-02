export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex bg-neutral-900"></aside>
      <main className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-l shadow-lg bg-neutral-800 border-neutral-600">
        {children}
      </main>
    </div>
  );
}
