import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import LineGraph from './LineGraph';
import Modal from 'react-modal'; 

interface JobData {
  work_year: number;
  experience_level: string;
  employment_type: string;
  job_title: string;
  salary: number;
  salary_currency: string;
  salary_in_usd: number;
  employee_residence: string;
  remote_ratio: number;
  company_location: string;
  company_size: string;
}

interface MainTableData {
  year: number;
  totalJobs: number;
  averageSalary: number;
}

const CsvReader: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [mainTableData, setMainTableData] = useState<MainTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<'year' | 'totalJobs' | 'averageSalary'>('year');
  const [selectedDirection, setSelectedDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedYear, setSelectedYear] = useState<number | null>(null); // Track selected year for displaying aggregated job titles
  const [aggregatedJobTitles, setAggregatedJobTitles] = useState<{ title: string; count: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close

  useEffect(() => {
    fetch('/salaries.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data as JobData[];
            setJobs(parsedData);
            generateMainTableData(parsedData);
            setIsLoading(false);
          },
        });
      })
      .catch(error => {
        console.error('Error fetching or parsing CSV:', error);
        setIsLoading(false);
      });
  }, []);

  const generateMainTableData = (data: JobData[]) => {
    const groupedByYear: { [key: number]: JobData[] } = {};

    data.forEach(job => {
      const numericSalaryInUsd = Number(job.salary_in_usd);
      if (!isNaN(numericSalaryInUsd)) {
        if (!groupedByYear[job.work_year]) {
          groupedByYear[job.work_year] = [];
        }
        groupedByYear[job.work_year].push(job);
      }
    });

    const mainTableData: MainTableData[] = [];
    Object.keys(groupedByYear).forEach(year => {
      const yearData = groupedByYear[parseInt(year, 10)];
      const totalJobs = yearData.length;
      const totalValidSalaries = yearData.reduce((sum, job) => sum + Number(job.salary_in_usd), 0);
      const validSalaryCount = yearData.length;
      const averageSalary = totalValidSalaries / validSalaryCount;
      mainTableData.push({ year: parseInt(year, 10), totalJobs, averageSalary });
    });

    mainTableData.sort((a, b) => a.year - b.year);

    setMainTableData(mainTableData);
  };

  const handleSortClick = () => {
    const sortedData = [...mainTableData].sort((a, b) => {
      if (selectedColumn === 'year' || selectedColumn === 'totalJobs') {
        return selectedDirection === 'asc' ? a[selectedColumn] - b[selectedColumn] : b[selectedColumn] - a[selectedColumn];
      } else if (selectedColumn === 'averageSalary') {
        return selectedDirection === 'asc' ? a[selectedColumn] - b[selectedColumn] : b[selectedColumn] - a[selectedColumn];
      }
      return 0;
    });

    setMainTableData(sortedData);
  };

  const handleRowClick = (year: number) => {
    setSelectedYear(year);
    setIsModalOpen(true); 
    const filteredJobs = jobs.filter(job => job.work_year == year);
    const jobTitleCounts: { [key: string]: number } = {};
    filteredJobs.forEach(job => {
      if (jobTitleCounts[job.job_title]) {
        jobTitleCounts[job.job_title]++;
      } else {
        jobTitleCounts[job.job_title] = 1;
      }
    });
    
    const aggregatedTitles = Object.entries(jobTitleCounts).map(([title, count]) => ({ title, count }));
  
    setAggregatedJobTitles(aggregatedTitles);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className=''>
          <h2 className="text-xl font-bold mt-4">Main Table</h2>
          <div className="flex justify-between mb-4 mt-4">
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value as 'year' | 'totalJobs' | 'averageSalary')}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="year">Year</option>
              <option value="totalJobs">Total Jobs</option>
              <option value="averageSalary">Average Salary (USD)</option>
            </select>
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value as 'asc' | 'desc')}
              className="border border-gray-300 p-2 rounded-md ml-4"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button
              onClick={handleSortClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Sort
            </button>
          </div>
          <div className='mt-20'>
            <table className="divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    Total Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                    Average Salary (USD)
                  </th>
                </tr>
              </thead>
              <tbody className ="bg-white divide-y divide-gray-200">
                {mainTableData.map((row, index) => (
                  <tr key={index} onClick={() => handleRowClick(row.year)} className="cursor-pointer hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.totalJobs}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.averageSalary.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Aggregated Job Titles Modal"
          >
            <h2 className="text-xl font-bold">{`Aggregated Job Titles for ${selectedYear}`}</h2>
            <table className="mt-4 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aggregatedJobTitles.map((titleData, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{titleData.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{titleData.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
          <div className="mt-10">
            <h2 className="text-xl font-bold">Line Graph</h2>
            <LineGraph data={mainTableData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvReader;

