import React, { useState } from 'react';
import { View, Text, TextInput, Platform, ActivityIndicator, TouchableOpacity, Alert, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { setUserRegistration } from './services/userRegistrationService';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';



export default function signup() {
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
    const [date, setDate] = useState(new Date()); // Control DatePicker visibility
    const[showPicker, setShowPicker] = useState(false);

    const toogleDatePicker = () => {
        setShowPicker((prev)=> !prev);
    }

    // const onChange = ({event: type}, selectDate) =>{
    //     if (type == "set"){
    //         const currentDate = selectedDate;
    //         setDate(currentDate);
    //     } else {
    //         toggleDatePicker();
    //     }
    // };

    const onChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            setForm({ ...form, date_of_birth: formatDate(selectedDate) });


            if(Platform.OS === "android"){
                toogleDatePicker();
                // setDate(selectedDate.toDateString());
            }
        }
        setShowPicker(false); // Hide picker after selection
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
            
            <View>
                <Text style={styles.label}>Date of Birth</Text>

                {showPicker && (
                    <DateTimePicker
                    mode = "date"
                    display="spinner"
                    value={date}
                    onChange={onChange}
                    />
                )}

                {!showPicker && (
                    <Pressable
                    onPress={toogleDatePicker}
                    >
                        <TextInput
                        style={styles.input}
                        placeholder='YYYY-MM-DD'
                        value={form.date_of_birth}
                        editable={false}
                        />
                    </Pressable>
                )}
            </View>
            

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
    label:{

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
