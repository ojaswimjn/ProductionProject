import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, Button } from "react-native";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const scheduleWaste = () => {
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Select a Pickup Date</Text>
      
      <Button title="Pick a Date" onPress={showDatePicker} />
      <Text style={{ fontSize: 16, marginTop: 10 }}>{selectedDate ? `Selected Date: ${selectedDate}` : "No date selected"}</Text>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={availableDates.length > 0 ? new Date(availableDates[0]) : new Date()}
        maximumDate={availableDates.length > 0 ? new Date(availableDates[availableDates.length -1]) : undefined}
        
      />

      <Text style={{ fontSize: 16, marginVertical: 10 }}>Waste Type</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 15,
          paddingLeft: 10,
          borderRadius: 8,
        }}
        placeholder="Enter waste type (Plastic, Paper, etc.)"
        value={wasteType}
        onChangeText={setWasteType}
      />

      <Text style={{ fontSize: 16, marginVertical: 10 }}>Weight (kg)</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 15,
          paddingLeft: 10,
          borderRadius: 8,
        }}
        placeholder="Enter weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#2196F3",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={handlePickupRequest}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Request Pickup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default scheduleWaste;
