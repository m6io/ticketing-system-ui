import { Navbar } from "@/components/Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background relative min-h-screen">
      <Navbar />
      <main className="p-4 sm:px-8 lg:px-44">
        <div className="mx-auto max-w-3xl space-y-20">{children}</div>
      </main>
    </div>
  );
};
