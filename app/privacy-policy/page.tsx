
export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Privacy Policy</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        <strong>Last Updated:</strong> 23 April 2025
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        DM My MP ({"we"}, {"us"}, or {"our"}) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our tool to contact your Member of Parliament (MP). By using DM My MP, you agree to the practices described in this policy. If you do not agree, please do not use our service.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">1. Information We Collect</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We collect the following types of information to facilitate your interaction with your MP and to improve our service:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Personal Information for Letter Generation:</strong> When you draft a letter, we collect your full name, address, postcode, and email address. This information is used solely to generate and send your letter to your MP and is not stored after the letter is sent.</li>
        <li><strong>Anonymized Data for Analysis:</strong> We store anonymized data, including the issue type, problem, solution (if provided), the outward code of your postcode (e.g., {"SW1A"} from {"SW1A 1AA"}), and your MP’s constituency. This data does not include personally identifiable information (PII) such as your name, full address, or email.</li>
        <li><strong>Usage Data:</strong> We may collect technical data such as your IP address, browser type, and usage patterns to improve our service. This data is anonymized and aggregated.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">2. How We Use Your Information</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We use the information we collect for the following purposes:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Letter Generation:</strong> Your personal information (name, address, postcode, email) is used to generate a letter to your MP and to open an email client for sending. This data is not retained after the email client is opened.</li>
        <li><strong>Engagement Analysis:</strong> Anonymized data (issue, problem, solution, outward code, constituency) is used to analyze local and national concerns, helping to hold MPs accountable and improve our tool’s effectiveness.</li>
        <li><strong>Service Improvement:</strong> Aggregated usage data helps us understand how our tool is used, identify technical issues, and enhance user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">3. Data Storage and Retention</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We are committed to data minimization:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Personal Information:</strong> Your name, address, full postcode, and email are not stored after the letter is sent. They are temporarily processed in memory during letter generation and discarded immediately after the email client is opened.</li>
        <li><strong>Anonymized Data:</strong> Anonymized data (e.g., issue, outward code, constituency) is stored indefinitely to support ongoing engagement analysis, unless you request deletion (see Section 6).</li>
        <li><strong>Secure Storage:</strong> All stored data is encrypted at rest using industry-standard encryption protocols (AES-256). Access to our database is restricted to authorized personnel only.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">4. Legal Basis for Processing</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We process your data under the following legal bases in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Consent:</strong> We collect and process your data only with your explicit consent, which you provide via the consent checkbox before generating a letter.</li>
        <li><strong>Legitimate Interests:</strong> We store anonymized data to analyze engagement trends and improve our service, which aligns with our legitimate interest in facilitating democratic engagement while protecting your privacy.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">5. Data Sharing</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We do not share your personal information with third parties, except as necessary to send your letter (e.g., your email client). Anonymized data may be shared in aggregated form (e.g., in reports or public dashboards) to highlight local and national concerns, but this data cannot be linked to you.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">6. Your Rights</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Under the UK GDPR, you have the following rights regarding your data:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Access:</strong> You can request access to the anonymized data we hold about your engagement (e.g., issue, outward code).</li>
        <li><strong>Rectification:</strong> You can request corrections to any inaccurate data.</li>
        <li><strong>Deletion:</strong> You can request the deletion of your anonymized data (e.g., issue, outward code, constituency) from our database.</li>
        <li><strong>Restriction:</strong> You can request that we restrict the processing of your data.</li>
        <li><strong>Objection:</strong> You can object to the processing of your data for legitimate interests.</li>
      </ul>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        To exercise these rights, please contact us at <a href="mailto:dmmymp@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">dmmymp@gmail.com</a>. We will respond to your request within one month, as required by law.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">7. Data Security</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We take the security of your data seriously. We use industry-standard measures, including encryption (AES-256), secure protocols (HTTPS), and access controls, to protect your data from unauthorized access, loss, or misuse. In the unlikely event of a data breach, we will notify affected users and the Information Commissioner’s Office (ICO) within 72 hours, as required by law.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">8. Cookies and Tracking</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        DM My MP does not use cookies or tracking technologies for profiling or advertising purposes. We may use temporary session data to maintain your session during use, which is deleted when you close your browser.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">9. Third-Party Links</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Our tool may include links to third-party websites (e.g., government statistics). We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies before providing any personal information.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">10. Changes to This Privacy Policy</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by updating the {"Last Updated"} date at the top of this page. Please review this policy periodically.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">11. Contact Us</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Email: <a href="mailto:dmmymp@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">dmmymp@gmail.com</a>
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        For further assistance, you may also consult a legal professional or contact the Information Commissioner’s Office (ICO) at <a href="https://ico.org.uk" className="text-blue-600 hover:underline dark:text-blue-400">https://ico.org.uk</a>.
      </p>
    </div>
  );
}