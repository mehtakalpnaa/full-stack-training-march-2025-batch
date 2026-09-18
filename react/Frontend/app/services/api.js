export const API_BASE_URL = "http://127.0.0.1:8000/docs";
export const fetchStudents = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/students`); 
        return Array.isArray(data) ? data : (data.students || []);
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};

export const searchStudents = async (query) => {
    try {
        const res = await fetch(`${API_BASE_URL}/students/search?query=${query}`); 
        return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
};

export const addStudent = async (studentData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });
        return await res.json();
    } catch (error) {
        console.error("Add error:", error);
    }
};

export const deleteStudent = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: "DELETE"
        });
        return await res.json();
    } catch (error) {
        console.error("Delete error:", error);
    }
};