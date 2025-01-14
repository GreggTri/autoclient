import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>

        <p className="mb-4 text-sm text-gray-600">Effective Date: <strong>01/14/2025</strong></p>

        <p className="mb-6 text-gray-700">
          <strong>AutoClient</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our website, applications, and other related services (collectively, the &quot;Services&quot;).
        </p>

        <p className="mb-6 text-gray-700">
          If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">1. Information We Collect</h2>

        <h3 className="text-lg font-semibold text-gray-700">(a) Information You Provide to Us</h3>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          <li><strong>Account Information</strong>: Name, email address, phone number, and other contact details when you sign up or contact us.</li>
          <li><strong>Payment Information</strong>: Billing details, credit card information, and other payment-related information (processed through secure third-party payment processors).</li>
          <li><strong>Feedback and Support</strong>: Any information you provide when contacting us for support or feedback.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-700">(b) Information We Automatically Collect</h3>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          <li><strong>Usage Data</strong>: Details about your interactions with the Services, such as pages viewed, time spent on pages, and clickstream data.</li>
          <li><strong>Device Information</strong>: Device type, operating system, browser type, IP address, and unique device identifiers.</li>
          <li><strong>Cookies and Tracking Technologies</strong>: Information collected via cookies and similar technologies to enhance your experience.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-700">(c) Information from Third Parties</h3>
        <p className="mb-6 text-gray-700">
          We may receive information about you from third-party sources, such as integrations with other software tools, social media platforms, or publicly available information.
        </p>

        {/* Repeat similar structure for the remaining sections */}

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">11. Contact Us</h2>
        <p className="text-gray-700">
          If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>

        <address className="mt-4 text-gray-700">
          <p><strong>AutoClient</strong></p>
          <p>Email: <a href="mailto:gregg@getautoclient.com" className="text-blue-600">gregg@getautoclient.com</a></p>
          <p>Phone: <a href="tel:2034828850" className="text-blue-600">(203) 482-8850</a></p>
        </address>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
