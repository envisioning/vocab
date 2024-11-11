"use client";

export default function NewsletterSignup() {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Newsletter
      </h3>
      <iframe
        src="https://newsletter.envisioning.io/embed"
        width="100%"
        height="320"
        style={{ border: "1px solid #EEE", background: "white" }}
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
