import { getArticles } from "@/lib/getArticles";
import ClientWrapper from "@/components/ClientWrapper";

export default async function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientWrapper
          articles={await getArticles()}
          displayMode="suggestions"
          showList={false}
        />
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto mt-6">
          <div className="px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">
              Oops! This page seems to have wandered off into the digital void.
            </p>
            <p className="text-gray-500 mb-8">
              Don't worry though - you can explore our vocabulary collection
              using the search bar above, or head back to the home page.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
