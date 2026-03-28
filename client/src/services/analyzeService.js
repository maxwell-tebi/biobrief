import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function analyzeImage(file) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await axios.post(`${API_BASE}/api/analyze`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function analyzeText(text) {
  const { data } = await axios.post(`${API_BASE}/api/analyze`, { text });
  return data;
}

export async function analyzeSymptoms({ symptoms, flagged }) {
  const { data } = await axios.post(`${API_BASE}/api/symptoms`, { symptoms, flagged });
  return data;
}
