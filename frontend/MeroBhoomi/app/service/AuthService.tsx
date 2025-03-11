import axios from 'axios';
const API_URL = 'http://10.0.2.2:8000/api/user/login/';  // For Android emulator
const userLogin = async (email: string, password: string) => {
  try {
    console.log('Request Payload:', { email, password });
    const response = await axios.post(API_URL, { email, password }, {
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