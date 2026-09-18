'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = "http://127.0.0.1:8000/students/";

export default function DashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    id: '', name: '', email: '', course: '', phone: '', status: '',
    batch: '', fees: '', city: '', mentor: '', gender: '', image_url: ''
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : (data.students || []));
      } else {
        console.error("Backend Error:", response.statusText);
      }
    } catch (err) {
      console.error("Backend Connection Failed!", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = formData.image_url;

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);

        const uploadRes = await fetch("http://127.0.0.1:8000/students/upload-image/", {
          method: "POST",
          body: imageFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.image_url;
        } else {
          alert("Image upload failed!");
          return;
        }
      }

      const finalData = {
        ...formData,
        id: Number(formData.id),
        age: 20, 
        image_url: uploadedImageUrl
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        await fetchStudents();
        resetForm();
        setShowModal(false);
      } else {
        const errJson = await response.json();
        console.error("Server validation error:", errJson);
        alert("Failed to save data in Backend!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error connecting to Backend!");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStudents(students.filter(student => student.id !== id));
      } else {
        alert("Delete failed on backend!");
      }
    } catch (err) {
      alert("Error deleting student!");
    }
  };

  const openUpdateModal = (e, student) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setFormData(student);
    setShowUpdateModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = formData.image_url;

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);

        const uploadRes = await fetch("http://127.0.0.1:8000/students/upload-image/", {
          method: "POST",
          body: imageFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.image_url;
        }
      }

      const finalData = {
        ...formData,
        id: Number(formData.id),
        image_url: uploadedImageUrl
      };

      const response = await fetch(`${API_URL}${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        await fetchStudents();
        resetForm();
        setSelectedStudent(null);
        setShowUpdateModal(false);
      } else {
        alert("Update failed on backend!");
      }
    } catch (err) {
      alert("Error updating student!");
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', email: '', course: '', phone: '', status: '', batch: '', fees: '', city: '', mentor: '', gender: '', image_url: '' });
    setSelectedFile(null);
  };

  if (selectedStudent && !showUpdateModal) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <button 
            onClick={() => setSelectedStudent(null)} 
            className="mb-6 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Student Full Information</h2>

          {selectedStudent.image_url && selectedStudent.image_url !== "string" && (
            <img src={selectedStudent.image_url} alt="Student" className="w-full h-64 object-cover rounded-xl mb-6" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Student ID:</strong> {selectedStudent.id}</p>
            <p><strong>Full Name:</strong> {selectedStudent.name}</p>
            <p><strong>Email Address:</strong> {selectedStudent.email}</p>
            <p><strong>Course:</strong> {selectedStudent.course}</p>
            <p><strong>Phone Number:</strong> {selectedStudent.phone}</p>
            <p><strong>Status:</strong> {selectedStudent.status}</p>
            <p><strong>Batch Timing:</strong> {selectedStudent.batch}</p>
            <p><strong>Fee Status:</strong> {selectedStudent.fees}</p>
            <p><strong>City / Location:</strong> {selectedStudent.city}</p>
            <p><strong>Mentor Assigned:</strong> {selectedStudent.mentor}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-10">
      <div className="flex justify-between items-center bg-white px-8 py-5 rounded-xl shadow-sm mb-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <button onClick={() => router.push('/login')} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors cursor-pointer">
          Logout
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Student Cards</h3>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer"
        >
          + Create New Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length > 0 ? (
          students.map((student) => (
            <div 
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                {student.image_url && student.image_url !== "string" && (
                  <img src={student.image_url} alt="Student" className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h4 className="text-xl font-bold text-gray-800 mb-3">{student.name}</h4>
                <p className="text-sm text-gray-600 mb-1"><strong className="text-gray-700">ID:</strong> {student.id}</p>
                <p className="text-sm text-gray-600 mb-1"><strong className="text-gray-700">Email:</strong> {student.email}</p>
                <p className="text-sm text-gray-600 mb-1"><strong className="text-gray-700">Course:</strong> {student.course}</p>
                <p className="text-sm text-gray-600 mb-4"><strong className="text-gray-700">Phone:</strong> {student.phone}</p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={(e) => openUpdateModal(e, student)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold text-sm transition-colors">Update</button>
                <button onClick={(e) => handleDelete(e, student.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">No students found or Backend Not Connected.</p>
        )}
      </div>

      {(showModal || showUpdateModal) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 overflow-y-auto z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{showUpdateModal ? 'Update Student Info' : 'Add New Student'}</h3>
            <form onSubmit={showUpdateModal ? handleUpdateStudent : handleCreateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="number" placeholder="Student ID (e.g. 1, 2...)" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Course Name" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Batch Timing" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Fee Status" value={formData.fees} onChange={(e) => setFormData({...formData, fees: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="City / Location" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Mentor Assigned" value={formData.mentor} onChange={(e) => setFormData({...formData, mentor: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              <input type="text" placeholder="Gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black" />
              
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Student Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm text-black bg-gray-50" />
              </div>

              <div className="col-span-full flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => { setShowModal(false); setShowUpdateModal(false); }} className="bg-gray-400 text-white px-5 py-2 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">{showUpdateModal ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}