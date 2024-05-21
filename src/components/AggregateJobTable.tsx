import React from 'react';

interface AggregatedJobTableProps {
  year: number;
  jobs: { job_title: string; count: number }[];
}

const AggregatedJobTable: React.FC<AggregatedJobTableProps> = ({ year, jobs }) => {
  return (
    <div>
      <h2>Jobs in {year}</h2>
      <table className="divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>Job Title</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={index}>
              <td>{job.job_title}</td>
              <td>{job.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AggregatedJobTable;
