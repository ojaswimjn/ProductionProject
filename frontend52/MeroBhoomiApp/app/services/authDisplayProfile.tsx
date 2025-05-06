import axios from "axios";
import { API_BASEURL } from "../authDisplayService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserProfile = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const response = await axios.get(`${API_BASEURL}/user/profile/`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log(AsyncStorage.getItem('accessToken'));
    console.log("datadata", response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export { getUserProfile };
