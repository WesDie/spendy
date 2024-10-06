import { TopNavBar } from "@/components/navigation/topNav/top-nav-bar";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <TopNavBar />
      <h3 className="text-2xl text-muted-foreground m-auto">Overview page</h3>
    </main>
  );
}
