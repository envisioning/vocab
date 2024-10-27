import fs from "fs";
import path from "path";
import { marked } from "marked";
import ClientWrapper from "@/components/ClientWrapper";
import { getArticles } from "@/lib/getArticles";

export default async function ReadmePage() {
  const readmePath = path.join(process.cwd(), "README.md");
  const readmeContent = fs.readFileSync(readmePath, "utf-8");
  const htmlContent = marked.parse(readmeContent);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientWrapper
          articles={await getArticles()}
          displayMode="suggestions"
          showList={false}
        />
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto mt-6">
          <div className="px-8 py-6">
            <div
              className="prose max-w-none 
                prose-headings:mt-8 prose-headings:mb-4
                prose-p:my-6 prose-p:leading-7
                prose-li:my-2 prose-li:leading-7
                prose-ul:my-4 prose-ol:my-4
                [&>p]:mb-8 [&>p]:mt-4
                [&>p]:text-gray-600
                [&>p+p]:mt-8"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
