// frontend/src/services/doctorService.js
import axios from "axios";

const VITE_BASE_URL = "http://localhost:5001/api/doctors";

export const getDoctors = async () => {
  const response = await axios.get(VITE_BASE_URL);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await axios.post(VITE_BASE_URL, doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await axios.put(`${VITE_BASE_URL}/${id}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await axios.delete(`${VITE_BASE_URL}/${id}`);
  return response.data;
};
