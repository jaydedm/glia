// import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth"
import { api, HydrateClient } from "~/trpc/server"
import Hero from "./_components/hero/hero"
import ParallaxText from "./_components/ParallaxText"
import EmailForm from "./_components/EmailForm"

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a2a0a] text-[#eaf5e9]">
        <Hero />
        <div className="container flex flex-col items-center justify-center">
          <div className="w-full overflow-hidden py-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <ParallaxText baseVelocity={15}>Request to Join</ParallaxText>
              <ParallaxText baseVelocity={-15}>Request to Join</ParallaxText>
            </div>
          </div>
          <div className="w-full max-w-md mx-auto p-16">
            <EmailForm />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
