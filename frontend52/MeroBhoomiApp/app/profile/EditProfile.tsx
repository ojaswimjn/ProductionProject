import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { API_BASEURL } from "../authDisplayService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable } from "react-native";

const { width, height } = Dimensions.get("window");

const EditProfile = () => {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASEURL}/user/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setFullName(res.data.full_name || "");
      setDateOfBirth(res.data.date_of_birth || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Could not load profile data.");
    }
  };

  const formatDate = (rawDate: Date) => {
    const d = new Date(rawDate);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const toggleDatePicker = () => setShowPicker(!showPicker);

    const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) {
        setDate(selectedDate);
        setDateOfBirth(formatDate(selectedDate));
    }
    };

  const updateProfile = async () => {
    if (!fullName || !dateOfBirth) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASEURL}/update-profile/`,
        {
          full_name: fullName,
          date_of_birth: dateOfBirth,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully.");
        router.push("/profileScreen");
      } else {
        Alert.alert("Error", response.data?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Date of Birth</Text>

        {showPicker && (
        <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={onChange}
            maximumDate={new Date()}
        />
        )}

        {!showPicker && (
        <Pressable onPress={toggleDatePicker}>
            <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dateOfBirth}
            editable={false}
            pointerEvents="none"
            />
        </Pressable>
        )}


        <TouchableOpacity
          style={styles.submitButton}
          onPress={updateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.push("/profileScreen")}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: width * 0.08,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#2B4B40",
    textAlign: "center",
    marginBottom: height * 0.05,
  },
  input: {
    width: "100%",
    padding: width * 0.04,
    borderRadius: 16,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#E8F1EE",
    backgroundColor: "#E8F1EE",
    fontSize: width * 0.04,
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#2B4B40",
    padding: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: height * 0.03,
  },
  cancelButtonText: {
    color: "#B22222",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    color: "#9D9D9D",
    marginLeft: width * 0.02,
    marginTop: height *0.01
},
});

export default EditProfile;
