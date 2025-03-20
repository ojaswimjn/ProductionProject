import axios from 'axios';
// export const API_BASEURL = 'http://10.0.2.2:8000/api';  // For Android emulator
export const API_BASEURL = 'http://192.168.10.68:8000/api';  // For Android emulator
// export const API_BASEURL = 'http://192.168.1.76:8001/api';  // For Android emulator
// const API_BASEURL = "http://172.22.16.40:8000/api"; // Replace with your PC's IP


const userLogin = async (email: string, password: string) => {
  try {
    console.log('Request Payload:', { email, password });
    const response = await axios.post(`${API_BASEURL}/user/login/`, { email, password }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('API Response:', response.data);
    return {
      access: response?.data?.token?.access,
      refresh: response?.data?.token?.refresh,
    };
  } catch (error: any) {
    console.log('Error Response:', error.response);  // Log full error response
    if (error.response) {
      console.log('Error Response Data:', error.response.data);
      console.log('Error Response Status:', error.response.status);
      console.log('Error Response Headers:', error.response.headers);
    } else {
      console.log('Error Message:', error.message);
    }
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};
export default { userLogin };