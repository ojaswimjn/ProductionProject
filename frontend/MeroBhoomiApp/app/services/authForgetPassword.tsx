import React from 'react';
import { API_BASEURL } from "../authDisplayService";
import axios from "axios";

export const sendOTP = async (email: string) => {
    
    try {
        const response = await axios.post(`${API_BASEURL}/sendotp/`, {email}, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"

            },
          });
        const data = await response.data;
        console.log("OTP sent successfully:", response.data);

        return response.data
    } catch (error) {
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};
