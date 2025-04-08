import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { API_BASEURL } from "../authDisplayService";


// Function to upload an image to the backend
const uploadImage = async (imageUri: string) => {
  try {
    // Check if the file exists at the given URI
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      console.error('File does not exist:', imageUri);
      return;
    }

    // Create a FormData object to hold the image data
    const formData = new FormData();
    formData.append('image_file', {
      uri: imageUri, // The URI of the selected image
      name: 'upload.jpg', // Name of the file being uploaded
      type: 'image/jpeg', // MIME type of the file
    } as any);

    // Retrieve the access token from AsyncStorage
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Send the POST request to the backend
    const response = await axios.post(
      `${API_BASEURL}/user/uploadimage/`,  // ✅ Use the base URL here
      formData, // Pass the FormData object as the body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authentication
          'Content-Type': 'multipart/form-data', // Set the content type for file uploads
        },
      }
    );

    console.log('Upload Success:', response.data); // Log the success response
    // router.push("/trashPrediction")
    return response.data;
  } catch (error: any) {
    // Handle errors during the upload process
    if (error.response) {
      console.error('Upload Error Response:', error.response.data); // Backend returned an error
    } else if (error.request) {
      console.error('Upload Error Request:', error.request); // No response from the server
    } else {
      console.error('Upload Error Message:', error.message); // Other errors
    }
  }
};

export default uploadImage;