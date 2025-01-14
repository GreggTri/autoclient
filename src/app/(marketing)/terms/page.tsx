import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms of Service</h1>

        <p className="mb-4 text-sm text-gray-600">Effective Date: <strong>01/14/2025</strong></p>

        <p className="mb-6 text-gray-700">
          Welcome to <strong>AutoClient</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our services, including our website, applications, and other related services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to these Terms. If you do not agree, please do not use our Services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">1. Use of Services</h2>
        <p className="mb-6 text-gray-700">
          You must be at least 18 years old to use our Services. You agree to use our Services only for lawful purposes and in compliance with these Terms. You are responsible for ensuring that your use of the Services does not violate any applicable laws or regulations.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">2. Account Responsibilities</h2>
        <p className="mb-6 text-gray-700">
          When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">3. Prohibited Activities</h2>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          <li>Engaging in fraudulent or deceptive activities.</li>
          <li>Interfering with the operation of the Services.</li>
          <li>Using the Services for illegal or unauthorized purposes.</li>
          <li>Attempting to gain unauthorized access to our systems.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">4. Intellectual Property</h2>
        <p className="mb-6 text-gray-700">
          All content and materials available on the Services, including text, graphics, logos, and software, are the property of AutoClient or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use any of our content without our prior written permission.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">5. Limitation of Liability</h2>
        <p className="mb-6 text-gray-700">
          To the fullest extent permitted by law, AutoClient shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the Services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">6. Termination</h2>
        <p className="mb-6 text-gray-700">
          We may terminate or suspend your access to the Services at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Services will cease immediately.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">7. Governing Law</h2>
        <p className="mb-6 text-gray-700">
          These Terms are governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved exclusively in the courts located in the United States.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">8. Changes to These Terms</h2>
        <p className="mb-6 text-gray-700">
          We may update these Terms from time to time. We will notify you of significant changes by posting the updated Terms on our website. Your continued use of the Services after the changes become effective constitutes your acceptance of the revised Terms.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">9. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;