
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const predictDelay = async (data) => {
  const response = await axios.post(`${API_BASE}/predict-delay`, data);
  return response.data;
};

export const recommendHospital = async (data) => {
  const response = await axios.post(`${API_BASE}/recommend-hospital`, data);
  return response.data;
};

export const fetchHospitals = async () => {
  const response = await axios.get(`${API_BASE}/hospitals`);
  return response.data;
};