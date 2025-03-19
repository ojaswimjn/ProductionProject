import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { setUserRegistration } from './services/userRegistrationService';
import DatePicker from 'react-native-date-picker';

export default function SignupScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        full_name: "",
        date_of_birth: "",
        tc: false,
        password: "",
        password2: "",
    });

    const [loading, setLoading] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false); // Control DatePicker visibility

    const handleInputChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSignup = async () => {
        if (!form.email || !form.full_name || !form.date_of_birth || !form.password || !form.password2) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        if (form.password !== form.password2) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const data = await setUserRegistration({
                ...form,
                date_of_birth: formatDate(new Date(form.date_of_birth)), // Ensure correct date format
            });
            Alert.alert("Success", "Account created successfully!");
            router.push("/login");
        } catch (error: any) {
            Alert.alert("Signup Failed", error.password?.[0] || error.email?.[0] || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={form.full_name}
                onChangeText={(text) => handleInputChange('full_name', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={styles.input}
                onPress={() => setOpenDatePicker(true)} // Open date picker modal
            >
                <Text style={styles.dateText}>
                    {form.date_of_birth || "Select Date of Birth"}
                </Text>
            </TouchableOpacity>

            {/* Date Picker Modal */}
            <DatePicker
                modal
                open={openDatePicker}
                date={form.date_of_birth ? new Date(form.date_of_birth) : new Date()} // Default to current date if not set
                mode="date"
                onConfirm={(date) => {
                    setOpenDatePicker(false); // Close the modal
                    setForm({ ...form, date_of_birth: formatDate(date) }); // Update form state with selected date
                }}
                onCancel={() => {
                    setOpenDatePicker(false); // Close the modal without changing the date
                }}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={form.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={form.password2}
                onChangeText={(text) => handleInputChange("password2", text)}
                secureTextEntry
            />

            <View style={styles.tcContainer}>
                <Text style={styles.tcText}>I agree to the Terms and Conditions</Text>
                <TouchableOpacity
                    onPress={() => setForm({ ...form, tc: !form.tc })}
                    style={styles.tcCheckbox}
                >
                    {form.tc && <Text style={styles.tcChecked}>✔</Text>}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupTextContainer} onPress={() => router.push("/login")}>
                <Text style={styles.signupText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
        backgroundColor: "#fff",
    },
    dateText: {
        fontSize: 16,
        color: "#aaa",
    },
    tcContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    tcText: {
        fontSize: 14,
        marginRight: 10,
    },
    tcCheckbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    tcChecked: {
        fontSize: 16,
        color: "green",
    },
    signupButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    signupButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signupTextContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    signupText: {
        color: "#007BFF",
        fontSize: 14,
    },
});
