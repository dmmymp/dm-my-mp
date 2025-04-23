
export default function TermsOfUse() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Terms of Use</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        <strong>Last Updated:</strong> 23 April 2025
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to DM My MP ({"we"}, {"us"}, or {"our"}). These Terms of Use ({"Terms"}) govern your access to and use of our tool, which assists users in drafting and sending letters to Members of Parliament (MPs) in the UK. By using DM My MP, you agree to be bound by these Terms. If you do not agree, please do not use our service.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">1. Purpose of the Service</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        DM My MP is a free, independent tool designed to help UK citizens draft and send letters to their MPs. The tool is currently in beta, and we reserve the right to modify, suspend, or discontinue the service at any time without notice.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">2. User Responsibilities</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        As a user of DM My MP, you agree to the following:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Content Responsibility:</strong> You are solely responsible for the content you generate, edit, or send through our tool, including its accuracy, legality, and appropriateness.</li>
        <li><strong>Compliance with Laws:</strong> Your content must comply with all applicable UK laws, including but not limited to the Public Order Act 1986, the Online Safety Act 2023, and the Communications Act 2003. Prohibited content includes threats, hate speech, harassment, defamation, spam, or any material that incites harm, violence, or discrimination.</li>
        <li><strong>Accuracy of Information:</strong> You must provide accurate information (e.g., postcode, personal details) to ensure the letter is sent to the correct MP. We are not responsible for errors resulting from incorrect information.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">3. Prohibited Conduct</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        You agree not to use DM My MP for any of the following:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li>Submitting content that is unlawful, threatening, abusive, defamatory, or otherwise objectionable.</li>
        <li>Engaging in spamming, phishing, or other malicious activities.</li>
        <li>Attempting to access, interfere with, or disrupt the tool’s infrastructure, security, or functionality.</li>
        <li>Using the tool for commercial purposes, political campaigning, or any purpose other than contacting your MP as an individual constituent.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">4. Our Role and Liability</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We provide a platform for drafting and sending letters, but we do not:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li><strong>Review or Endorse Content:</strong> We do not review, edit, or endorse the content you generate. We are not responsible for its accuracy, legality, or any consequences arising from its use.</li>
        <li><strong>Guarantee Delivery or Response:</strong> We facilitate sending your letter via your email client, but we do not guarantee that your MP will receive, read, or respond to your letter.</li>
        <li><strong>Accept Liability:</strong> To the fullest extent permitted by law, we disclaim liability for any direct, indirect, incidental, or consequential damages arising from your use of the tool, including but not limited to legal consequences of your content.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">5. Termination and Suspension</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We reserve the right to suspend or terminate your access to DM My MP at our sole discretion, without notice, if we believe you have violated these Terms. If your content is deemed illegal or harmful, we may report it to the relevant authorities, including law enforcement, as required by law.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">6. Intellectual Property</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        All content and materials on DM My MP, including the tool’s design, code, and branding, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reproduce any part of the tool without our prior written consent.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">7. Third-Party Links</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        DM My MP may include links to third-party websites (e.g., government resources). We are not responsible for the content, accuracy, or practices of these websites. Use them at your own risk.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">8. Governing Law and Dispute Resolution</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        These Terms are governed by the laws of England and Wales. Any disputes arising from your use of DM My MP will be subject to the exclusive jurisdiction of the courts of England and Wales. You agree to attempt to resolve any disputes informally by contacting us before pursuing legal action.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">9. Changes to These Terms</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        We may update these Terms from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by updating the {"Last Updated"} date at the top of this page. Your continued use of the tool after such changes constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">10. Contact Us</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        If you have any questions, concerns, or requests regarding these Terms, please contact us at:
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Email: <a href="mailto:dmmymp@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">dmmymp@gmail.com</a>
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        For further assistance, you may also consult a legal professional.
      </p>
    </div>
  );
}