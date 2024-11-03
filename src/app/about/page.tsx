import fs from "fs";
import path from "path";
import { marked as markedImport } from "marked";
const marked = markedImport;
import ClientWrapper from "@/components/ClientWrapper";
import { getArticles } from "@/lib/getArticles";

export default async function ReadmePage() {
  const readmePath = path.join(process.cwd(), "README.md");
  const readmeContent = fs.readFileSync(readmePath, "utf-8");

  // Simple configuration without custom renderer
  marked.use({
    headerIds: true,
    headerPrefix: "",
  });

  const htmlContent = marked.parse(readmeContent);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientWrapper
          articles={(await getArticles()) ?? []}
          displayMode="suggestions"
          showList={false}
        />
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto mt-6">
          <div className="px-8 py-6">
            <div
              className="prose max-w-none
                prose-headings:font-display
                prose-h1:text-2xl prose-h1:font-bold prose-h1:text-gray-900 prose-h1:mb-6 prose-h1:mt-12
                prose-h2:text-xl prose-h2:font-semibold prose-h2:text-gray-800 prose-h2:mb-4 prose-h2:mt-10
                prose-h3:text-lg prose-h3:font-medium prose-h3:text-gray-700 prose-h3:mb-4 prose-h3:mt-8
                prose-h4:text-m prose-h4:font-medium prose-h4:text-gray-700 prose-h4:mb-3 prose-h4:mt-6
                prose-p:text-gray-600 prose-p:leading-7 prose-p:mb-4
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:my-2 prose-li:text-gray-600
                prose-hr:my-8 prose-hr:border-gray-200"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
