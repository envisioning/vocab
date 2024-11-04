import Link from "next/link";
import namesData from "@/data/names.json";
import { toTitleCase } from "@/lib/formatters";

export default function ContributorsPage() {
  // Get unique contributors and count their contributions
  const contributorCounts = new Map<string, number>();

  Object.values(namesData).forEach((names) => {
    names.forEach((name) => {
      if (name.toLowerCase() !== "unknown") {
        contributorCounts.set(name, (contributorCounts.get(name) || 0) + 1);
      }
    });
  });

  // Convert to array and sort by contribution count
  const sortedContributors = Array.from(contributorCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              Contributors
            </h1>
            <div className="grid grid-cols-1 gap-2">
              {sortedContributors.map(([name, count]) => (
                <Link
                  key={name}
                  href={`/contributors/${name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="p-4 hover:bg-gray-50 rounded-lg transition-colors flex justify-between items-center"
                >
                  <span className="text-lg text-gray-900">
                    {toTitleCase(name)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {count} contribution{count !== 1 ? "s" : ""}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// In the getStaticParams and anywhere else we process names
export function generateStaticParams() {
  const uniqueNames = new Set<string>();

  Object.values(namesData).forEach((names) => {
    names.forEach((name) => {
      if (name.toLowerCase() !== "unknown") {
        uniqueNames.add(name.toLowerCase().replace(/\s+/g, "-"));
      }
    });
  });

  return Array.from(uniqueNames).map((name) => ({
    name: name,
  }));
}
