import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraType, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get("window");

export default function ImagePickerExample() {
  const [permission, requestPermission] = useCameraPermissions();

  const pickImage = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
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

  const openCamera = async () => {
    await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/identifyWasteg.webp")} style={styles.image} />
      <Text style={styles.overlayText}>Identify Your Trash</Text>
      <View style={styles.buttonContainer}>
        <Button title="Open Camera" onPress={openCamera} />
        <Button title="Open Gallery" onPress={pickImage} />
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
    width: 250, // Adjust width to display the left section
    height: 400,
    marginBottom: 20,
    overflow: 'hidden', // Hides the part of the image on the right
  }
  ,
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});
