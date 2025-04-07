import Link from "next/link";

// import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Hero from "./hero/page";
import ParallaxText from "./_components/ParallaxText";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
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
            <ParallaxText baseVelocity={-5}>Request to Join</ParallaxText>
            <ParallaxText baseVelocity={5}>Request to Join</ParallaxText>
          </div>
          <div className="w-full max-w-md mx-auto p-16">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent bg-white/10 text-[#eaf5e9] placeholder-gray-400"
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d4af37] hover:text-[#eaf5e9] transition-colors"
                aria-label="Submit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
