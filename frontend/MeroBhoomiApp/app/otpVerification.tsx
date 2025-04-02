import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import { API_BASEURL } from "./authDisplayService";

const { width, height } = Dimensions.get('window');

const OTPVerification = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');

    // Retrieve email from the route parameters using useLocalSearchParams
    const { email: routeEmail } = useLocalSearchParams();

    useEffect(() => {
        if (routeEmail) {
            // Ensure routeEmail is treated as a string
            const emailString = Array.isArray(routeEmail) ? routeEmail[0] : routeEmail;
            setEmail(emailString);
        }
    }, [routeEmail]);

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASEURL}/otpverify/`, 
                JSON.stringify({
                    email: email,
                    otp: otp
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success) {
                Alert.alert('Success', 'OTP verified successfully.');
                router.push(`/resetPassword?email=${email}&otp=${otp}`);
            } else {
                Alert.alert('Error', 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>OTP Verification</Text>
            <Text style={styles.label}>Enter OTP</Text>
            
            <TextInput
                style={styles.otpInput}
                placeholder="_ _ _ _ _ _"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
            />
            
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
                <Text style={styles.signinText}>Didn't receive OTP?</Text>
                <TouchableOpacity onPress={() => router.push('/forgetPassword')}>
                    <Text style={styles.signinLink}>Resend</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        marginBottom: height * 0.08,
    },
    label: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginLeft: width * 0.1,
        color: '#9D9D9D',
    },
    otpInput: {
        width: '80%',
        padding: width * 0.04,
        borderRadius: 16,
        marginVertical: height * 0.02,
        borderWidth: 1,
        borderColor: '#E8F1EE',
        backgroundColor: '#E8F1EE',
        fontSize: width * 0.05,
    },
    verifyButton: {
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
    footerContainer: {
        position: 'absolute',
        bottom: height * 0.05,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signinText: {
        fontSize: width * 0.04,
        color: '#9D9D9D',
    },
    signinLink: {
        color: '#2B4B40',
        fontWeight: '600',
        marginLeft: 5,
    },
});

export default OTPVerification;