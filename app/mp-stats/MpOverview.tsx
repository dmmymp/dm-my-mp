import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MpOverviewProps {
  name: string;
  constituency: string;
  party: string;
  photoUrl?: string;
  roles?: string[];
  speechCount?: number;
  debateRank?: number;
  attendPercent?: number;
  attendRank?: number;
  responseRate?: string;
  giftsSummary?: string;
  votingRecord?: { topic: string; votes: number }[];
  voteAttendance?: number | null;
  votingAlignment?: { topic: string; alignment: string }[];
  rebelliousVotes?: number;
}

const MpOverview: React.FC<MpOverviewProps> = ({
  name,
  constituency,
  party,
  photoUrl = '/default-mp.jpg',
  roles = [],
  speechCount = 0,
  debateRank,
  attendPercent,
  attendRank,
  responseRate = 'Data unavailable',
  giftsSummary = 'No recorded interests',
  votingRecord = [],
  voteAttendance = null,
  votingAlignment = [],
  rebelliousVotes = 0,
}) => {
  const attendanceData = [
    { name: name, Attendance: voteAttendance || 0 },
    { name: 'Party Avg', Attendance: 80 },
    { name: 'National Avg', Attendance: 74.3 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 w-full">
      <div className="flex items-center mb-6">
        <img
          src={photoUrl}
          alt={name}
          className="w-20 h-28 rounded-md object-cover mr-4 border"
          onError={(e) => (e.currentTarget.src = '/default-mp.jpg')}
        />
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600">{party} MP for {constituency}</p>
          {roles.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">{roles.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Voting Interests (Votes)</h3>
          {votingRecord.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {votingRecord.map((item, i) => (
                <li key={i}>
                  {item.topic}: <strong>{item.votes}</strong> votes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent voting data available.</p>
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Vote Attendance (%)</h3>
          {voteAttendance !== null ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Attendance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No attendance data available.</p>
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Voting Alignment</h3>
          {votingAlignment.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {votingAlignment.map((item, i) => (
                <li key={i}>
                  {item.topic}: <strong>{item.alignment}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No alignment data available.</p>
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Activity in Parliament</h3>
          <p className="text-sm">Spoke in <b>{speechCount}</b> debates this year</p>
          {debateRank && <p className="text-sm">Debate rank: <b>{debateRank}/650</b></p>}
          {attendPercent !== undefined && attendRank && (
            <p className="text-sm">Vote attendance: <b>{attendPercent}%</b> (Rank: {attendRank}/650)</p>
          )}
          <p className="text-sm">Rebellious Votes: <b>{rebelliousVotes}</b></p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Responsiveness</h3>
          <p className="text-sm">Replies to messages: <b>{responseRate}</b></p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-gray-700 mb-2">Outside Interests</h3>
          <p className="text-sm">{giftsSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default MpOverview;
