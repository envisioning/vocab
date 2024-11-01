"use client";

import { useState } from "react";
import { AlertCircle, X, Send } from "lucide-react";
import emailjs from "@emailjs/browser";

interface ReportErrorButtonProps {
  slug: string;
  title: string;
}

export default function ReportErrorButton({
  slug,
  title,
}: ReportErrorButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        "service_q677yur", // YOUR_SERVICE_ID
        "template_4tvzbxk", // YOUR_TEMPLATE_ID
        {
          article_title: title,
          article_slug: slug,
          feedback: feedback,
          page_url: window.location.href,
          user_name: name,
          user_email: email,
        },
        "_nPrChBm9cWPnRVcx" // YOUR_PUBLIC_KEY
      );
      setStatus("success");
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus("idle");
        setFeedback("");
        setName("");
        setEmail("");
      }, 2000);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-2"
      >
        <AlertCircle className="w-4 h-4" />
        Report Content Error
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Report Content Error
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Help us improve by reporting any errors or issues you've found
                in this article.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-gray-600 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-600 mb-1"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe the error or issue..."
                    className="w-full h-32 p-3 border rounded-lg resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-blue-500 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : status === "success" ? (
                    "Thank you!"
                  ) : status === "error" ? (
                    "Error - Try Again"
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Report
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
