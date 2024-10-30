import fs from "fs";
import path from "path";
import Link from "next/link";

export default function ComponentsListPage() {
  // Get all files from all directories
  const zeroDir = path.join(process.cwd(), "src/components/articles/0");
  const okDir = path.join(process.cwd(), "src/components/articles/1-ok");
  const adjustDir = path.join(
    process.cwd(),
    "src/components/articles/2-adjust"
  );

  const zeroFiles = fs
    .readdirSync(zeroDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(".tsx", ""));

  const okFiles = fs
    .readdirSync(okDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(".tsx", ""));

  const adjustFiles = fs
    .readdirSync(adjustDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(".tsx", ""));

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold mb-6">Component Directory</h1>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              0 Components ({zeroFiles.length})
            </h2>
            <ul className="space-y-2 mb-8 list-decimal pl-5">
              {zeroFiles.map((file) => (
                <li key={file} className="hover:bg-gray-50 p-2 rounded pl-1">
                  <Link
                    href={`/${file}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {file}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              1-ok Components ({okFiles.length})
            </h2>
            <ul className="space-y-2 mb-8 list-decimal pl-5">
              {okFiles.map((file) => (
                <li key={file} className="hover:bg-gray-50 p-2 rounded pl-1">
                  <Link
                    href={`/${file}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {file}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              2-adjust Components ({adjustFiles.length})
            </h2>
            <ul className="space-y-2 list-decimal pl-5">
              {adjustFiles.map((file) => (
                <li key={file} className="hover:bg-gray-50 p-2 rounded pl-1">
                  <Link
                    href={`/${file}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {file}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
