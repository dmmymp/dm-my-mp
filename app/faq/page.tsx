
export default function FAQ() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Frequently Asked Questions</h1>
      
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">1. Will my MP respond to my letter?</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        MPs receive many messages and may not respond immediately. Response times vary depending on their workload, the issue raised, and their office’s processes. Some MPs may take weeks or months to reply, while others may not respond at all. We recommend following up directly with your MP’s office if you don’t hear back within a month.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">2. How can I ensure my letter gets a response?</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        While there’s no guarantee, you can increase your chances by:
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        <li>Being clear and concise in your message.</li>
        <li>Focusing on issues relevant to your constituency.</li>
        <li>Providing specific examples or personal experiences (while avoiding sensitive data).</li>
        <li>Following up politely after a reasonable period (e.g., 4 weeks).</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">3. What happens if my MP doesn’t receive my letter?</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        DM My MP opens your email client to send the letter directly to your MP’s email address. If the email fails to send (e.g., due to a typo in the email address or a technical issue), you can copy the letter and send it manually. We recommend double-checking the email address and ensuring your email client is set up correctly.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">4. How can I contact support if I have an issue?</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        If you encounter any issues with DM My MP, please email us at <a href="mailto:dmmymp@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">dmmymp@gmail.com</a>. We’ll respond as soon as possible, typically within 48 hours.
      </p>
    </div>
  );
}