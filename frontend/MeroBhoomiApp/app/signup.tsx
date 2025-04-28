import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { setUserRegistration } from './services/userRegistrationService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get("window");

export default function Signup() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        full_name: "",
        date_of_birth: "",
        tc: false, // Terms and Conditions checkbox state
        password: "",
        password2: "",
    });

    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    const toggleDatePicker = () => {
        setShowPicker((prev) => !prev);
    };

    const onChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            setForm({ ...form, date_of_birth: formatDate(selectedDate) });
            if (Platform.OS === "android") toggleDatePicker();
        }
        setShowPicker(false);
    };

    const handleInputChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isValidPassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
        return regex.test(password);
    };

    const handleSignup = async () => {
        if (!form.email || !form.full_name || !form.date_of_birth || !form.password || !form.password2) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        if (!isValidEmail(form.email)) {
            Alert.alert("Error", "Please enter a valid email address!");
            return;
        }

        if (!isValidPassword(form.password)) {
            Alert.alert("Error", "Password must be at least 6 characters long with 1 number and 1 special character.");
            return;
        }

        if (form.password !== form.password2) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }

        if (!form.tc) {
            setErrorMessage("You must agree to the Terms and Conditions to proceed."); // Show error message
            return;
        }

        setLoading(true);
        try {
            const data = await setUserRegistration({
                ...form,
                date_of_birth: formatDate(new Date(form.date_of_birth)),
            });
            Alert.alert("Success", "Account created successfully!");
            router.push("/login");
        } catch (error: any) {
            Alert.alert("Signup Failed", error.password?.[0] || error.email?.[0] || "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Sign Up',
                }}
            />

            <View style={styles.container}>
                <Text style={styles.header}>Create an account</Text>

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
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Date of Birth</Text>
                {showPicker && (
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date}
                        onChange={onChange}
                    />
                )}
                {!showPicker && (
                    <Pressable onPress={toggleDatePicker}>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={form.date_of_birth}
                            editable={false}
                        />
                    </Pressable>
                )}

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
                    <TouchableOpacity
                        onPress={() => {
                            setForm({ ...form, tc: !form.tc });
                            setErrorMessage(""); // Clear error message when toggled
                        }}
                        style={styles.checkbox}
                    >
                        {form.tc && <Text style={styles.checkboxTick}>✔</Text>}
                    </TouchableOpacity>
                    <Text style={styles.tcText}>I agree to the Terms and Conditions</Text>
                </View>

                {/* Error message for Terms and Conditions */}
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginRedirect}
                    onPress={() => router.push("/login")}
                >
                    <Text style={styles.loginText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

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
    label: {
        fontSize: 16,
        color: "#9D9D9D",
        marginLeft: width * 0.02,
        marginBottom: height * 0.005,
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
    tcContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: height * 0.01,
        marginLeft: 5,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderColor: "#2B4B40",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    checkboxTick: {
        fontSize: 16,
        color: "green",
    },
    tcText: {
        fontSize: width * 0.04,
        color: "#9D9D9D",
    },
    signupButton: {
        width: "100%",
        backgroundColor: "#2B4B40",
        padding: height * 0.016,
        borderRadius: 30,
        alignItems: "center",
        marginTop: height * 0.02,
    },
    signupButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginRedirect: {
        alignItems: "center",
        marginTop: height * 0.03,
    },
    loginText: {
        color: "#2B4B40",
        fontWeight: "600",
        fontSize: width * 0.04,
    },
    errorText: {
        color: "red",
        fontSize: width * 0.035,
        marginLeft: width * 0.02,
        marginTop: height * 0.01,
    },
});