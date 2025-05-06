import axios from "axios";
import { API_BASEURL } from "../authDisplayService";

interface UserRegistrationData {
    email: string;
    full_name: string;
    date_of_birth: string;
    tc: boolean;
    password: string;
    password2: string;
  }
  
  const setUserRegistration = async (userData: UserRegistrationData): Promise<any> => {
    try {
    const response = await axios.post(`${API_BASEURL}/user/register/`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error in user registration:", error.response?.data || error.message);
    throw error;
  }
};

export { setUserRegistration };
