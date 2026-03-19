import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiFilter, FiPrinter, FiFileText } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const MyResults = () => {
  const { student } = useOutletContext();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examType, setExamType] = useState('All');

  useEffect(() => {
    fetchResults();
  }, [examType]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await studentApi.get(`/results?examType=${examType}`);
      setResults(res.data);
    } catch (err) {
      showToast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateSummary = () => {
    if (results.length === 0) return { pct: 0, total: 0, pass: 0, fail: 0 };
    
    let totalMarks = 0;
    let obtMarks = 0;
    let pass = 0;
    let fail = 0;

    results.forEach(r => {
      totalMarks += r.fullMarks;
      obtMarks += r.marksObtained;
      if (['F', 'D'].includes(r.grade)) {
        fail++;
      } else {
        pass++;
      }
    });

    return {
      pct: totalMarks > 0 ? ((obtMarks / totalMarks) * 100).toFixed(2) : 0,
      total: results.length,
      pass,
      fail
    };
  };

  const summary = calculateSummary();

  const getPercentageSpan = (marks, full) => {
    const p = ((marks / full) * 100).toFixed(1);
    return `${p}%`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:m-0 print:p-0 print:max-w-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#a7f3d0] print:hidden">
        <h1 className="text-2xl font-black text-[#064e3b] flex items-center gap-3 tracking-tight">
          <div className="bg-[#ecfdf5] p-2 rounded-xl text-[#059669]">
            <FiFileText size={24} />
          </div>
          My Exam Results
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#f0fdf4] px-4 py-2 rounded-lg border border-[#a7f3d0]">
            <FiFilter className="text-[#059669]" />
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="bg-transparent text-sm font-medium focus:outline-none text-[#064e3b]"
            >
              <option value="All">All Exams</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
            </select>
          </div>
          
          <button
            onClick={handlePrint}
            className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-md active:scale-95"
          >
            <FiPrinter size={20} /> Print Result
          </button>
        </div>
      </div>

      {/* Print Header (Visible only in print mode) */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-black mb-1">KASTURI COLLEGE</h1>
        <h2 className="text-xl font-bold mb-4">Official Grade Report</h2>
        <div className="flex flex-wrap justify-between text-left font-mono border border-black p-4 bg-gray-50">
          <div>
            <p className="font-bold">Name: <span className="font-normal">{student?.fullName}</span></p>
            <p className="font-bold">Roll No: <span className="font-normal">{student?.rollNumber}</span></p>
          </div>
          <div>
            <p className="font-bold">Class: <span className="font-normal">{student?.class} '{student?.section}'</span></p>
            <p className="font-bold">Date: <span className="font-normal">{new Date().toLocaleDateString()}</span></p>
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#a7f3d0] overflow-hidden print:border-black print:shadow-none">
          {results.length === 0 ? (
            <div className="p-16 text-center text-[#064e3b] opacity-60 flex flex-col items-center">
              <FiFileText size={48} className="mb-4 text-[#a7f3d0]" />
              <p className="text-xl font-medium">No results published yet for the selected criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap print:text-black">
                  <thead className="bg-[#ecfdf5] text-[#059669] border-b border-[#a7f3d0] print:border-black uppercase text-xs font-black tracking-wider print:bg-gray-100 print:text-black">
                    <tr>
                      <th className="px-6 py-5">Subject</th>
                      <th className="px-6 py-5">Exam</th>
                      <th className="px-6 py-5 text-right font-mono">Full Marks</th>
                      <th className="px-6 py-5 text-right font-mono">Obtained</th>
                      <th className="px-6 py-5 text-right font-mono">%</th>
                      <th className="px-6 py-5 text-center">Grade</th>
                      <th className="px-6 py-5 text-center">Status</th>
                      <th className="px-6 py-5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#a7f3d0]/30 print:divide-gray-300">
                    {results.map((r) => {
                      const isPass = !['F', 'D'].includes(r.grade);
                      return (
                        <tr key={r._id} className="hover:bg-[#f0fdf4] transition-colors print:border-b print:border-gray-200">
                          <td className="px-6 py-4 font-bold text-[#064e3b] print:text-black">{r.subject}</td>
                          <td className="px-6 py-4 font-medium text-[#047857] print:text-black">{r.examType}</td>
                          <td className="px-6 py-4 text-right font-mono opacity-80">{r.fullMarks}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold">{r.marksObtained}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-[#059669]">{getPercentageSpan(r.marksObtained, r.fullMarks)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border print:border-black print:bg-transparent md:block inline-block
                              ${['A+','A'].includes(r.grade) ? 'bg-[#d1fae5] text-[#059669] border-[#6ee7b7]' : 
                                ['F','D'].includes(r.grade) ? 'bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]' : 
                                'bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]'}`}>
                              {r.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {isPass ? (
                              <span className="text-[#059669] font-black tracking-widest text-xs uppercase print:text-black">Pass</span>
                            ) : (
                              <span className="text-[#dc2626] font-black tracking-widest text-xs uppercase print:text-black">Fail</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-[#047857] print:text-black">{r.remarks || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-[#f0fdf4] border-t border-[#a7f3d0] p-6 print:border-black print:bg-gray-50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-x divide-[#a7f3d0] print:divide-black">
                  <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-1 print:text-black">Overall Score</p>
                     <p className="text-3xl font-black font-mono text-[#064e3b] print:text-black">{summary.pct}%</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-1 print:text-black">Subjects</p>
                     <p className="text-3xl font-black font-sans text-[#064e3b] print:text-black">{summary.total}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-1 print:text-black">Passed</p>
                     <p className="text-3xl font-black font-sans text-[#059669] print:text-black">{summary.pass}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-[#059669] mb-1 print:text-black">Failed</p>
                     <p className="text-3xl font-black font-sans text-[#dc2626] print:text-black">{summary.fail}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyResults;
