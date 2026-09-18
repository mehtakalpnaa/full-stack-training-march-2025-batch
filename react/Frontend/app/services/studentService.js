const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error("Failed to fetch students");
    const data = await response.json();
    
    
    if (Array.isArray(data)) return data;
    return data.students || data.data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}