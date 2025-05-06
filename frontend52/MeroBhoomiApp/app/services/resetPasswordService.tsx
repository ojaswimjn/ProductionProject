import React from 'react';
import { API_BASEURL } from "../authDisplayService";
import axios from "axios";

export const resetPasswordService = async (email:string, otp:number, newPassword:string, confirmPassword:string) => {
    try {
        const response = await axios.post(`${API_BASEURL}/resetpassword/`, {
            email: email,
            otp: otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        const data = await response.data;
        console.log("Password reset successfully:", data);

        return data;  // Return response data (success or failure message)
    } catch (error) {
        console.error("Error resetting password:", error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};
