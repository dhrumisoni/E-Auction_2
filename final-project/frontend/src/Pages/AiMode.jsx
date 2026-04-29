import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AiMode = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const questions = [
    "How does profile image upload work?",
    "How can I change my city in profile?",
    "How is phone number validation handled?",
    "How do I contact support?",
    "How do I send a message from contact page?",
    "What happens after submitting a contact message?",
    "How do I place a bid on an auction?",
    "Where do auctions appear?",
    "How do I list an item to sell?",
    "What is the admin inbox for?",
    "How does admin approve bids?",
    "How can I view my profile details?",
    "How do I update my address?",
    "What fields are required for signup?",
    "How do I logout?",
    "How do I view bid history?",
    "How do I upload bid documents?",
    "How do auto bids work?",
    "What does the dashboard show?",
    "How do I switch between user and admin features?"
  ];

  const answers = {
    "how does profile image upload work?":
      "Project profile features include image uploads, city selection, and phone validation for users.",
    "how can i change my city in profile?":
      "City selection is managed on the profile page and the form keeps the selected city when updating user details.",
    "how is phone number validation handled?":
      "Phone validation in the project uses a simple numeric check and requires a correctly formatted contact number.",
    "how do i contact support?":
      "The contact page lets users submit messages, and admins can view those messages in the inbox area.",
    "how do i send a message from contact page?":
      "Users can send a message on the contact page and the admin inbox stores messages for review.",
    "what happens after submitting a contact message?":
      "After submission, the message is stored and admins can see it in the inbox section of the admin panel.",
    "how do i place a bid on an auction?":
      "Auctions are displayed on the Auctions page and users can place bids through the bidding interface.",
    "where do auctions appear?":
      "Auction listings appear on the Auctions page, where users can browse available items and bid.",
    "how do i list an item to sell?":
      "Use the Sell Form page to add a new auction item, upload details, and submit it for bidding.",
    "what is the admin inbox for?":
      "The admin inbox stores messages sent through the contact page so admins can manage user inquiries.",
    "how does admin approve bids?":
      "The admin panel includes bid management features where admins can review active bids and winners.",
    "how can i view my profile details?":
      "Your profile page shows your personal details and lets you update them with validated information.",
    "how do i update my address?":
      "Address changes are handled on the profile page when editing user details and saving the updated form.",
    "what fields are required for signup?":
      "Signup requires basic user information, email, and password to create a new account.",
    "how do i logout?":
      "Use the logout button or page to end your session and return to the home page.",
    "how do i view bid history?":
      "Bid history is available in the user dashboard or profile area, showing past bids placed.",
    "how do i upload bid documents?":
      "Bid document upload is supported for some listings via the bid details or bid submission flow.",
    "how do auto bids work?":
      "Auto bids are processed by the bidding system to place bids automatically based on user settings.",
    "what does the dashboard show?":
      "The dashboard shows active bids, user stats, and auction summaries for admin users.",
    "how do i switch between user and admin features?":
      "The admin section is separate; users access their profile and auctions, while admins use the admin panel.",
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setAnswer("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: question.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(`Error: ${data.message || 'Failed to get an answer'}`);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAnswer("Failed to connect to the server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-16 text-gray-900">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
      >
        Back
      </button>
      <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#056973]">AI Mode</h1>
          <p className="mt-4 text-lg text-gray-600">
            Ask about eAuction project features and get quick, project-related answers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-lg font-semibold text-gray-700">
              Your question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about auctions, profiles, bidding, contact, or admin features"
              className="w-full rounded-3xl border border-gray-300 bg-[#f7fafc] px-5 py-4 text-base text-gray-900 outline-none transition focus:border-[#056973]"
              rows={5}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[#056973] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a575c] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        <div className="mt-10 rounded-3xl border border-gray-200 bg-[#f7fafc] p-6">
          <h2 className="text-2xl font-bold text-[#056973]">Choose one of the 20 project questions</h2>
          <p className="mt-2 text-gray-600">
            Click any question below to load it in the form and get a project-only answer.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  setAnswer("");
                }}
                className="rounded-3xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-800 transition hover:border-[#056973] hover:bg-[#ecf9f9]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {answer && (
          <div className="mt-8 rounded-3xl border border-[#d1e7eb] bg-[#f0fbfb] p-6 text-lg text-gray-800">
            <h2 className="text-xl font-bold text-[#0e5b61]">AI Answer</h2>
            <p className="mt-4 leading-8">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMode;
