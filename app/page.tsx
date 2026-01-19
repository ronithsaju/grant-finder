import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Let us help you find the right grant.
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Discover grants tailored to your goals in just a few steps.
        </p>

        <div className="mt-10">
          <Button
            asChild
            className="rounded-full bg-black text-white px-8 py-3"
          >
            <Link href="/find">Find Grant</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
