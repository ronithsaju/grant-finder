import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function FindGrantPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-900">
          What type of grant are you looking for?
        </h1>

        <div className="mt-6">
          <Textarea
            placeholder="Describe your project, organization, or funding needs..."
            className="
                min-h-[140px]
                border-gray-300
                bg-gray-50
                text-gray-900
                placeholder:text-gray-400
                focus:border-gray-900
                focus:ring-gray-900
            "
          />
        </div>

        <div className="mt-6">
          <Button className="rounded-full bg-black text-white px-8 py-3">
            Find
          </Button>
        </div>
      </div>
    </main>
  );
}
