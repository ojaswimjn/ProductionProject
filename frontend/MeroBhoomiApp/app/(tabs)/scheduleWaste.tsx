import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_BASEURL } from "../authDisplayService";
import { getUserProfile } from "../services/authDisplayProfile";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const ScheduleWaste = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (params.latitude && params.longitude) {
      setLatitude(parseFloat(params.latitude as string));
      setLongitude(parseFloat(params.longitude as string));
    }
  }, [params]);

  useEffect(() => {
    fetchAvailableDates();
    fetchUserId();
  }, []);

  const fetchAvailableDates = async () => {
    try {
      const response = await axios.get(`${API_BASEURL}/availabledates/`);
      setAvailableDates(response.data.available_dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  const fetchUserId = async () => {
    const userProfile = await getUserProfile();
    const user_id = userProfile.id;
    setUserId(user_id);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (availableDates.includes(formattedDate)) {
      setSelectedDate(formattedDate);
    } else {
      Alert.alert("Error", "Selected date is not available");
    }
    hideDatePicker();
  };

  const handlePickupRequest = async () => {
    if (!selectedDate || !wasteType || !weight) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const requestData = {
      request_date: selectedDate,
      request_status: "Pending",
      weight: weight,
      waste_type: "organic",
      latitude: latitude,
      longitude: longitude,
      user_id: userId,
    };

    try {
      await axios.post(`${API_BASEURL}/pickuprequest/`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      Alert.alert("Success", "Pickup request submitted successfully!");
    } catch (error) {
      console.error("Error submitting pickup request:", error);
      Alert.alert("Error", "Failed to submit pickup request");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule Waste Pickup</Text>

      <Text style={styles.label}>Select a Pickup Date</Text>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>Pick a Date</Text>
      </TouchableOpacity>
      <Text style={styles.selectedDate}>
        {selectedDate ? `Selected Date: ${selectedDate}` : "No date selected"}
      </Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={availableDates.length > 0 ? new Date(availableDates[0]) : new Date()}
        maximumDate={availableDates.length > 0 ? new Date(availableDates[availableDates.length - 1]) : undefined}
      />

      <Text style={styles.label}>Waste Type</Text>
      <Text style={styles.input}>Organic</Text> {/* Non-editable text displaying "Organic" */}


      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      {/* Hint text below the input field for weight */}
      <Text style={styles.hintText}>
        e.g., 2 garbage bags (5 kg)
      </Text>

      <Text style={styles.label}>Select Location</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/locationMap")}>
        <Text style={styles.buttonText}>
          {latitude && longitude ? "Change location" : "Pick location"}
        </Text>
      </TouchableOpacity>

      {latitude && longitude && (
        <Text style={styles.selectedDate}>
          Selected Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      )}

      <TouchableOpacity style={styles.sendButton} onPress={handlePickupRequest}>
        <Text style={styles.buttonText}>Request Pickup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Slightly light background for a cleaner look
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#2B4B40",
    marginBottom: height * 0.05,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: width * 0.1,
    color: "#555", // Darker text color for better readability
    marginTop: height * 0.02,
  },
  input: {
    width: "80%",
    padding: width * 0.05,
    borderRadius: 16,
    marginVertical: height * 0.015,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: width * 0.04,
    elevation: 3, // Slight shadow for input fields to make them pop
  },
  button: {
    width: "80%",
    backgroundColor: "#2B4B40",
    paddingVertical: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.02,
    elevation: 5, // Adds shadow effect to the buttons
  },
  sendButton: {
    width: "80%",
    backgroundColor: "#2B4B40",
    paddingVertical: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.04,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedDate: {
    fontSize: width * 0.04,
    marginTop: height * 0.01,
    color: "#333",
    textAlign: "center",
  },
  hintText: {
    fontSize: 14,
    color: "#777", // Light gray text color for hint
    // marginTop: height * 0.01,
    // textAlign: "center",
  },
});

export default ScheduleWaste;
