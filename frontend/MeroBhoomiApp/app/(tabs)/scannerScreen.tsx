import { useState,useEffect } from 'react';
import { Button, Image, View, StyleSheet, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraType, useCameraPermissions } from 'expo-camera';
import uploadImage from '../services/uploadImage'; // Import the upload function
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function ImagePickerExample() {
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Corrected type
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async (pickerType: "camera" | "gallery") => { // Explicitly typed
    let result;
    if (pickerType === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setIsLoading(true)
      setSelectedImage(imageUri); // Corrected state update
      console.log("Selected Image URI:", imageUri);

      try{
        const response = await uploadImage(imageUri); // Upload image after selecting it

        if(response){
          router.push({
            pathname: "/trashPrediction",
            params: {
              image: imageUri,  // Use the freshly captured image URI
              response: JSON.stringify(response),
            },
          });      
        }
      }catch(error : any){
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
      finally {
        // Hide the loading indicator after navigation or failure
        setIsLoading(false);
      }

    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/identifyWasteg.webp")} style={styles.image} />
      <Text style={styles.overlayText}>Identify Your Trash</Text>

      {/* Preview the selected image */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2B4B40" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
       )}
      

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleImagePick("camera")}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleImagePick("gallery")}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 250,
    height: 420,
    marginBottom: 20,
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: "#2B4B40",
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#2B4B40',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 200,
  },
  
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2B4B40",
  },
  
});
