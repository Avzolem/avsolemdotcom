"use client";

import { mailchimp } from "@/resources";
import { useState } from "react";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

type NewsletterProps = {
  display: boolean;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
};

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    if (email === "") {
      return true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const debouncedHandleChange = debounce(handleChange, 2000);

  const handleBlur = () => {
    setTouched(true);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    }
  };

  return (
    <div className="relative overflow-hidden w-full p-8 rounded-xl mb-4 flex flex-col items-center text-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 shadow-sm dark:shadow-none">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {mailchimp.effects.gradient.display && (
          <div
            className="absolute"
            style={{
              background: `linear-gradient(${mailchimp.effects.gradient.tilt}deg, ${mailchimp.effects.gradient.colorStart}, ${mailchimp.effects.gradient.colorEnd})`,
              opacity: mailchimp.effects.gradient.opacity,
              left: `${mailchimp.effects.gradient.x}%`,
              top: `${mailchimp.effects.gradient.y}%`,
              width: `${mailchimp.effects.gradient.width}%`,
              height: `${mailchimp.effects.gradient.height}%`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '100%',
              filter: 'blur(60px)',
            }}
          />
        )}
        {mailchimp.effects.dots.display && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${mailchimp.effects.dots.color} 1px, transparent 1px)`,
              backgroundSize: `${mailchimp.effects.dots.size}px ${mailchimp.effects.dots.size}px`,
              opacity: mailchimp.effects.dots.opacity,
            }}
          />
        )}
      </div>

      <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-2">
        {newsletter.title}
      </h3>
      <p
        className="relative text-gray-500 dark:text-gray-400 mb-6 text-balance"
        style={{ maxWidth: '320px' }}
      >
        {newsletter.description}
      </p>
      <form
        className="w-full flex justify-center"
        action={mailchimp.action}
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
      >
        <div id="mc_embed_signup_scroll" className="flex flex-col gap-2 w-full max-w-sm">
          <div className="flex flex-col gap-1">
            <input
              id="mce-EMAIL"
              name="EMAIL"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => {
                if (error) {
                  handleChange(e);
                } else {
                  debouncedHandleChange(e);
                }
              }}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                error
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white placeholder-gray-500`}
            />
            {error && (
              <span className="text-xs text-red-500 text-left">{error}</span>
            )}
          </div>
          <div style={{ display: "none" }}>
            <input
              type="checkbox"
              readOnly
              name="group[3492][1]"
              id="mce-group[3492]-3492-0"
              value=""
              checked
            />
          </div>
          <div id="mce-responses" className="clearfalse">
            <div className="response" id="mce-error-response" style={{ display: "none" }}></div>
            <div className="response" id="mce-success-response" style={{ display: "none" }}></div>
          </div>
          <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
            <input
              type="text"
              readOnly
              name="b_c1a5a210340eb6c7bff33b2ba_0462d244aa"
              tabIndex={-1}
              value=""
            />
          </div>
          <div className="clear">
            <div className="h-12 flex items-center">
              <button
                id="mc-embedded-subscribe"
                type="submit"
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
