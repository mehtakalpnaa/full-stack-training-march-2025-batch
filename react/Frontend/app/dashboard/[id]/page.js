'use client';

import { useParams, useRouter } from 'next/navigation';
import initialStudents from '@/app/data/studentData.json';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = Number(params.id);

  const student = initialStudents.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Student Not Found</h2>
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Exact 10 information fields stored/provided by you
  const studentInfoList = [
    { label: 'Student ID', value: student.id },
    { label: 'Full Name', value: student.name },
    { label: 'Email Address', value: student.email },
    { label: 'Enrolled Course', value: student.course },
    { label: 'Phone Number', value: student.phone },
    { label: 'Enrollment Status', value: student.status || 'Active' },
    { label: 'Batch Timing', value: student.batch || 'Morning' },
    { label: 'Fee Status', value: student.fees || 'Paid' },
    { label: 'City / Location', value: student.city || 'Dehradun' },
    { label: 'Mentor Assigned', value: student.mentor || 'Senior Dev' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-sm text-gray-500">Complete Student Information Profile (10 Details)</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentInfoList.map((info, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {index + 1}. {info.label}
              </span>
              <span className="text-base font-semibold text-gray-800">
                {info.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}