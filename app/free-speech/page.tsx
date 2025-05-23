import React from "react";
import Link from "next/link";

export default function FreeSpeechPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Your Free Speech Rights in the UK</h1>
      <p className="text-gray-700 mb-4">
        In the UK, you have the right to express your opinions and criticize government policies, but laws also set limits to protect public order and prevent harm. This page explains your free speech rights, recent laws affecting them, and how you can use this platform to <strong>strategically voice concerns to your MP in a way that cannot be censored</strong>.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">What Are Your Free Speech Rights?</h2>
      <p className="text-gray-700 mb-4">
        The UK doesn’t have a written constitution, but free speech is protected under:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          <strong>Article 10 of the European Convention on Human Rights (ECHR)</strong>: Guarantees the right to freedom of expression, balanced against public safety, order, health, morals, and the rights of others.
        </li>
        <li>
          <strong>Common Law</strong>: Historically supports free speech, but courts can limit it if deemed harmful or offensive.
        </li>
      </ul>
      <p className="text-gray-700 mb-4">
        However, laws such as the <strong>Public Order Act 1986</strong> and the <strong>Online Safety Act 2023</strong> increasingly regulate speech, particularly online. Critics argue this creates a <strong>chilling effect</strong> where people self-censor to avoid legal trouble.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">Why Writing to Your MP is a Powerful Free Speech Tool</h2>
      <p className="text-gray-700 mb-4">
        Unlike social media, where content can be <strong>censored, removed, or shadow-banned</strong>, letters to MPs are:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li><strong>Legally protected</strong> &ndash; MPs are required to receive and consider constituent letters.</li>
        <li><strong>Private and direct</strong> &ndash; No risk of moderation by tech companies.</li>
        <li><strong>Politically effective</strong> &ndash; If enough people raise the same issue, MPs must respond, and pressure can influence lawmaking.</li>
      </ul>
      <p className="text-gray-700 mb-4">
        This platform allows UK citizens to <strong>use their democratic rights strategically</strong>, ensuring concerns about free speech, censorship, and civil liberties <strong>cannot be ignored or suppressed</strong>.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">How to Use This Tool for Free Speech</h2>
      <p className="text-gray-700 mb-4">
        You can use this website to write to your MP about free speech concerns, including:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Government overreach in <strong>online censorship</strong> under the Online Safety Act.</li>
        <li>Cases where people have been <strong>arrested or investigated for lawful speech</strong>.</li>
      </ul>
      <p className="text-gray-700 mb-4">
        To make the most impact while staying within legal boundaries, follow these steps:
      </p>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        <li>Enter your <strong>UK postcode</strong> on the homepage to find your MP.</li>
        <li>Select an issue such as <strong>Government Overreach - Free Speech Restrictions</strong> or <strong>Proposed Laws That Threaten Civil Liberties</strong>.</li>
        <li><strong>Frame your argument carefully</strong>:
          <ul className="list-disc list-inside ml-4">
            <li>Stick to <strong>facts, legal precedent, and democratic principles</strong>.</li>
            <li>Ask your MP <strong>specific policy-related questions</strong>.</li>
            <li>Avoid <strong>hostile or inflammatory language</strong>, as this weakens your case.</li>
          </ul>
        </li>
        <li>Use our <strong>AI-assisted letter generator</strong> to refine your message.</li>
        <li>Send your letter via email, or use the <strong>copy &amp; paste</strong> feature to manually contact your MP.</li>
      </ol>
      <p className="text-gray-700 mb-4">
        By taking these steps, you are exercising your <strong>right to petition</strong> and ensuring that concerns about censorship are heard where they matter most&mdash;<strong>in Parliament</strong>.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">Resources and Support</h2>
      <p className="text-gray-700 mb-4">
        If you’re concerned about free speech issues in the UK, these organizations provide useful guidance:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          <a href="https://www.libertyhumanrights.org.uk" className="text-blue-600 hover:underline">Liberty</a>: Advocates for civil liberties and free expression, offering legal advice and resources.
        </li>
        <li>
          <a href="https://freespeechunion.org" className="text-blue-600 hover:underline">Free Speech Union</a>: Supports individuals facing free speech challenges, with case studies and guidance.
        </li>
        <li>
          <a href="https://www.theyworkforyou.com" className="text-blue-600 hover:underline">TheyWorkForYou</a>: Tracks MP activities and provides contact info for engaging with representatives.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 text-black">Take Action Today</h2>
      <p className="text-gray-700 mb-4">
        Don’t let fear of censorship silence your concerns. By writing to your MP, you <strong>force the political system to acknowledge your views</strong>. Get started now:
      </p>
      <p className="text-gray-700">
        <Link href="/" className="text-blue-600 hover:underline">Find Your MP &amp; Write a Letter</Link>
      </p>

      <footer className="mt-8 text-center text-gray-600">
        <p>
          <Link href="/terms-of-use" className="text-blue-600 hover:underline">Terms of Use</Link> |{" "}
          <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}