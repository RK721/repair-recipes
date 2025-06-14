import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        <strong>Write2Repair</strong> respects your privacy. We collect only the
        information necessary to provide our services, such as your username,
        email, and any content you submit.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>
          Your data is never sold or shared with third parties except as
          required by law.
        </li>
        <li>Passwords are securely hashed and never stored in plain text.</li>
        <li>
          You can delete your account and data at any time from your profile
          page.
        </li>
        <li>We use cookies only for authentication and session management.</li>
      </ul>
      <p>
        For questions or concerns, please contact us at{" "}
        <a
          href="mailto:privacy@write2repair.net"
          className="text-blue-600 underline"
        >
          privacy@write2repair.net
        </a>
        .
      </p>
    </div>
  );
}
