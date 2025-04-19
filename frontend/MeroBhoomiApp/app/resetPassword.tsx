import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASEURL } from "./authDisplayService";
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get('window');

const ResetPassword = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Retrieve email and otp from the route parameters using useLocalSearchParams
    const { email, otp } = useLocalSearchParams();

    const isValidPassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{6,}$/;
        return regex.test(password);
      };
      
    useEffect(() => {
        console.log("Retrieved email:", email);
        console.log("Retrieved OTP:", otp);
    }, [email, otp]);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please enter all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        if (!isValidPassword(password)) {
            Alert.alert(
              "Invalid Password",
              "Password must be at least 6 characters long, contain at least one number, one letter, and one special character."
            );
            return;
          }
          
        console.log("Sending Data:", { email, otp, password, confirmPassword });

        try {
            const response = await axios.post(`${API_BASEURL}/resetpassword/`, 
            {
                email: email,
                otp: otp,
                new_password: password,   // Use new_password instead of password
                confirm_password: confirmPassword // Add confirm_password
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
            );

            if (response.data.success) {
                Alert.alert('Success', 'Password reset successfully.', [
                    { text: 'OK', onPress: () => router.push('/login') }
                ]);
            } else {
                Alert.alert('Error', 'Failed to reset password. Please try again.');
            }
        } catch (error: any) {
            console.log("Error Details:", error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An error occurred. Please try again later33.');
        }
    };

    return (
        <>
            <Stack.Screen 
                options={{
                headerShown: true, 
                title: 'Reset Password', 
                }} 
            />
            <View style={styles.container}>
                <Text style={styles.header}>Reset Password</Text>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </>    
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: width * 0.05,
    },
    header: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        color: '#2B4B40',
        marginBottom: height * 0.04,
    },
    label: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginLeft: width * 0.1,
        color: '#9D9D9D',
    },
    input: {
        width: '80%',
        padding: width * 0.04,
        borderRadius: 16,
        marginVertical: height * 0.005,
        borderWidth: 1,
        borderColor: '#E8F1EE',
        backgroundColor: '#E8F1EE',
        fontSize: 16,
        marginBottom: height * 0.02,
    },
    resetButton: {
        width: '80%',
        backgroundColor: '#2B4B40',
        padding: height * 0.016,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ResetPassword;