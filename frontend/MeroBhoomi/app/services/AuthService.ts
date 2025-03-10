import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/";

export const userLogin = async(email: string,passowrd: string) => {
    const response = await axios.post(`${API_URL}/user/login`, {email,passowrd});
    if (response.data.token){
        return response.data.token;
    }
    else{
        console.log("Invalid login credentials")
    }

}