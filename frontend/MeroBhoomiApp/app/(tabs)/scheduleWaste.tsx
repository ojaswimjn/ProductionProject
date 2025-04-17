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
  const [wasteType, setWasteType] = useState("organic");
  const [weight, setWeight] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userId, setUserId] = useState();
  const [isSuccess, setIsSuccess] = useState(false);


  useEffect(() => {
    if (params.latitude && params.longitude) {
      setLatitude(parseFloat(params.latitude as string));
      setLongitude(parseFloat(params.longitude as string));
    }
    if (params.selectedDate) setSelectedDate(params.selectedDate as string);
    if (params.weight) setWeight(params.weight as string);
    if (params.wasteType) setWasteType(params.wasteType as string)
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
      waste_type: wasteType, // ← use the state here
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

      Alert.alert("Success", "Your pickup has been scheduled! You will receive points after the waste has been picked up.");
      // console.log("reached here")
      setIsSuccess(true); // trigger the form reset

    } catch (error) {
      console.error("Error submitting pickup request:", error);
      Alert.alert("Error", "Failed to submit pickup request");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSelectedDate("");
      setWeight("");
      setWasteType("organic");
      setLatitude(null);
      setLongitude(null);
  
      router.replace("/scheduleWaste"); // Reload this page without any params

      setIsSuccess(false); // reset the flag

    }
  }, [isSuccess]);
  

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
      <View style={styles.input}>
        <Text style={{ fontSize: width * 0.04 }}>Organic</Text>
      </View>

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
      <TouchableOpacity style={styles.button} onPress={() => 
        router.push({
          pathname: "/locationMap",
          params: {
            selectedDate,
            weight,
            wasteType,
            latitude: latitude?.toString() || "",
            longitude: longitude?.toString() || "",
          },
        }
        )       
      }>
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
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2B4B40",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    width: "100%",
    backgroundColor: "#2B4B40",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#1E3D34",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedDate: {
    fontSize: 15,
    color: "#444",
    marginTop: 10,
    textAlign: "center",
  },
  hintText: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
});


export default ScheduleWaste;
