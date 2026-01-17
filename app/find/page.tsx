import { Button } from "@/components/ui/button";

export default function FindGrantPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-900">
          What sector of grants are you looking for?
        </h1>

        <div className="mt-6">
          <select
            className="
                w-full
                rounded-md
                border
                border-gray-300
                bg-gray-50
                p-3
                text-gray-900
                focus:border-gray-900
                focus:ring-gray-900
                focus:outline-none
            "
            defaultValue=""
          >
            <option value="" disabled>
              Select the sector your organisation is involved in
            </option>
            <option value="Arts, Heritage & Culture">
              Arts, Heritage & Culture
            </option>
            <option value="Youth & Education">Youth & Education</option>
            <option value="Community Care & Social Services">
              Community Care & Social Services
            </option>
            <option value="Environment & Public Spaces">
              Environment & Public Spaces
            </option>
            <option value="Sports & Physical Activity">
              Sports & Physical Activity
            </option>
            <option value="Community Integration & Social Cohesion">
              Community Integration & Social Cohesion
            </option>
          </select>
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
