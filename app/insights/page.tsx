"use client";

import React from "react";

export default function Insights() {
  const allConstituenciesStats = [
    { issue: "Cost of Living", count: 320, percentage: 35 },
    { issue: "Healthcare", count: 250, percentage: 27 },
    { issue: "Housing", count: 150, percentage: 16 },
    { issue: "Crime & Safety", count: 100, percentage: 11 },
    { issue: "Education", count: 80, percentage: 9 },
  ];

  const holbornStats = [
    { issue: "Cost of Living", count: 45, percentage: 40, topConcern: "Energy bills are soaring, straining local families." },
    { issue: "Healthcare", count: 30, percentage: 27, topConcern: "NHS waiting times are delaying care for local patients." },
    { issue: "Housing", count: 20, percentage: 18, topConcern: "Rents are unaffordable for many in our constituency." },
    { issue: "Crime & Safety", count: 10, percentage: 9, topConcern: "Petty crime is rising in our neighborhoods." },
    { issue: "Other", count: 8, percentage: 7, topConcern: "Local park maintenance is neglected." },
  ];

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
        Constituency Insights (See What Your Neighbours Care About)
      </h1>
      <p className="text-gray-700 mb-6 dark:text-gray-300 text-center">
        Anonymized concerns from letters sent by constituents. Data reflects opt-in submissions across UK constituencies.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Top 5 Issues Nationwide</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          {allConstituenciesStats.map((stat, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="w-1/3 text-black dark:text-white">{stat.issue}</div>
              <div className="w-2/3">
                <div className="bg-blue-500 dark:bg-blue-600 h-4 rounded" style={{ width: `${stat.percentage}%` }}></div>
              </div>
              <div className="ml-4 text-black dark:text-white">{stat.percentage}% ({stat.count} letters)</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Example: Holborn and St Pancras</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          {holbornStats.map((stat, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <div className="w-1/3 text-black dark:text-white">{stat.issue}</div>
                <div className="w-2/3">
                  <div className="bg-green-500 dark:bg-green-600 h-4 rounded" style={{ width: `${stat.percentage}%` }}></div>
                </div>
                <div className="ml-4 text-black dark:text-white">{stat.percentage}% ({stat.count} letters)</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top Concern: {stat.topConcern}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 text-center text-gray-600 dark:text-gray-300">
        <p>
          <a href="/terms-of-use" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Terms of Use</a> | 
          <a href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</a> | 
          <a href="/free-speech" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Your Free Speech Rights</a>
        </p>
      </footer>
    </div>
  );
}