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

const { width, height } = Dimensions.get("window");

const ScheduleWaste = () => {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userId] = useState(2);

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const fetchAvailableDates = async () => {
    try {
      const response = await axios.get("http://192.168.10.68:8000/api/availabledates/");
      setAvailableDates(response.data.available_dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
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

    const requestData = {
      request_date: selectedDate,
      request_status: "Pending",
      weight: weight,
      waste_type: wasteType,
      latitude: 37.7749,
      longitude: -122.4194,
      user_id: userId,
    };

    try {
      await axios.post("http://192.168.10.68:8000/api/pickuprequest/", requestData);
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
      <Text style={styles.selectedDate}>{selectedDate ? `Selected Date: ${selectedDate}` : "No date selected"}</Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={availableDates.length > 0 ? new Date(availableDates[0]) : new Date()}
        maximumDate={availableDates.length > 0 ? new Date(availableDates[availableDates.length - 1]) : undefined}
      />

      <Text style={styles.label}>Waste Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter waste type (Plastic, Paper, etc.)"
        value={wasteType}
        onChangeText={setWasteType}
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

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
    backgroundColor: "#ffffff",
    paddingHorizontal: width * 0.05,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#2B4B40",
    marginBottom: height * 0.05,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: width * 0.1,
    color: "#9D9D9D",
    marginTop: height * 0.015,
  },
  input: {
    width: "80%",
    padding: width * 0.04,
    borderRadius: 16,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#E8F1EE",
    backgroundColor: "#E8F1EE",
    fontSize: width * 0.04,
  },
  button: {
    width: "80%",
    backgroundColor: "#2B4B40",
    padding: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  sendButton: {
    width: "80%",
    backgroundColor: "#2B4B40",
    padding: height * 0.016,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.04,
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
  },
});

export default ScheduleWaste;
