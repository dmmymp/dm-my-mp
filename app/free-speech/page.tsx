"use client";

import React from "react";
import Link from "next/link"; // Added import for Link

export default function FreeSpeechPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Your Free Speech Rights in the UK</h1>
      <p className="text-gray-700 mb-4">
        In the UK, you have the right to express your opinions and criticize government policies, but there are limits set by laws to protect public order and prevent harm. This page explains your free speech rights, recent laws that impact them, and how you can use this tool to safely voice concerns to your MP.
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
          <strong>Common Law</strong>: Historically supports free speech, but courts can limit it if it’s deemed harmful or offensive.
        </li>
      </ul>
      <p className="text-gray-700 mb-4">
        However, recent laws and court cases have shaped these rights, sometimes restricting speech to prevent hate speech, incitement, or online harm.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">Key Laws Affecting Free Speech</h2>
      <p className="text-gray-700 mb-4">
        Several UK laws impact your ability to speak freely:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          <strong>Public Order Act 1986</strong>: Restricts speech or actions that could cause “harassment, alarm, or distress” or incite hatred based on race, religion, or sexuality. For example, protests or public statements can be limited if deemed offensive.
        </li>
        <li>
          <strong>Online Safety Act 2023</strong>: Regulates online content, requiring platforms to remove illegal or harmful material, including hate speech or misinformation. This has led to concerns about censorship of legitimate free expression.
        </li>
        <li>
          <strong>Terrorism Act 2000 and 2006</strong>: Prohibits speech that glorifies or incites terrorism, with broad interpretations that can lead to arrests for social media posts.
        </li>
      </ul>
      <p className="text-gray-700 mb-4">
        These laws aim to balance free speech with public safety, but they’ve sparked debates about government overreach, especially with arrests for social media posts or peaceful protests.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">Recent Cases and Trends</h2>
      <p className="text-gray-700 mb-4">
        Recent court cases highlight the tension around free speech in the UK:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          <strong>Harry Miller’s Case (2020)</strong>: A court ruled that police visiting Miller over transphobic tweets violated his free speech rights, but the Online Safety Act 2023 could still allow similar actions under new rules.
        </li>
        <li>
          <strong>Arrests for Social Media Posts</strong>: In 2024-2025, several individuals were arrested for tweets or posts criticizing government policies, raising concerns about chilling effects on free expression.
        </li>
      </ul>
      <p className="text-gray-700 mb-4">
        These cases show the importance of staying informed and using tools like this website to voice concerns responsibly and within the law.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">How to Use This Tool for Free Speech</h2>
      <p className="text-gray-700 mb-4">
        Use this website to write to your MP about free speech restrictions or government overreach. Here’s how:
      </p>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        <li>Enter your UK postcode on the homepage to find your MP.</li>
        <li>Select an issue like “Government Accountability - Policy Criticism” or “Government Overreach - Free Speech Restrictions.”</li>
        <li>Draft a letter describing your concerns (e.g., arrests for social media posts, censorship under the Online Safety Act 2023), keeping it factual and non-threatening to comply with UK laws.</li>
        <li>Use our AI to tidy and format your letter, then email it to your MP or share anonymously on X to raise awareness.</li>
      </ol>
      <p className="text-gray-700 mb-4">
        Our tool ensures you can express yourself safely while staying within legal boundaries, as outlined in our disclaimer.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">Resources and Support</h2>
      <p className="text-gray-700 mb-4">
        For more information on free speech in the UK, visit these organizations:
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
      <p className="text-gray-700 mb-4">
        These organizations can help you understand your rights and take action against restrictions.
      </p>

      <h2 className="text-xl font-semibold mb-2 text-black">Take Action Today</h2>
      <p className="text-gray-700 mb-4">
        Don’t let government overreach silence your voice. Use this tool to write to your MP about free speech concerns, join the movement for open expression, and share your letter anonymously on X to inspire others. Visit the{" "}
        <Link href="/" className="text-blue-600 hover:underline">homepage</Link> to get started.
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