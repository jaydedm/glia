"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, instagramHandle, reason }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        setInstagramHandle("");
        setReason("");
      } else {
        setMessage({ text: "Failed to send request. Please try again.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred. Please try again later.", type: "error" });
      console.error(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative">
      <motion.div
        key="form-container"
        className="w-full h-[400px] bg-white/5 backdrop-blur-sm border border-[#d4af37]/20 rounded-xl p-6 shadow-lg flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-4"
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent bg-white/10 text-[#eaf5e9] placeholder-gray-400"
                  disabled={isSubmitting}
                />
              </div>
              <input
                type="text"
                placeholder="Social @handle or N/A"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent bg-white/10 text-[#eaf5e9] placeholder-gray-400"
                disabled={isSubmitting}
              />
              <textarea
                placeholder="Why do you want to join Glia?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent bg-white/10 text-[#eaf5e9] placeholder-gray-400 min-h-[100px] resize-y"
                disabled={isSubmitting}
              />
              {message && (
                <div className={`mt-2 text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message.text}
                </div>
              )}
              <button
                type="submit"
                className="w-full mt-1 px-6 py-3 rounded-lg bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center"
            >
              <h2 className="text-[#d4af37] text-2xl font-bold font-serif">see you soon</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
