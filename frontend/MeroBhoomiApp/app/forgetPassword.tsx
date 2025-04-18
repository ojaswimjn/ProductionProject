import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Dimensions } from 'react-native';
import { sendOTP } from './services/authForgetPassword';
import { useRouter } from "expo-router";
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get("window");

const ForgetPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleSendOTP = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email.');
            return;
        }


        const result = await sendOTP(email);
        if (result.success) {
            Alert.alert('Success', result.data || 'Please check your email. OTP link has been sent sucessfully.');
            router.push({
                pathname: '/otpVerification',
                params: { email: email } // Pass the email as a query parameter
            });            
            return email;
        } else {
            Alert.alert('Error', result.message || 'Failed to send OTP');
        }
    };

    return (
        <>
            <Stack.Screen 
                options={{
                headerShown: true, 
                title: 'Forgot Password', 
                }} 
            />
            <View style={styles.container}>
                <Text style={styles.header}>Forgot Password</Text>
                <Text style={styles.label}>Enter email address</Text>
                <TextInput
                    style={styles.Textinput}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendOTP}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
                
                <View style={styles.footerContainer}>
                    <Text style={styles.signinText}>Don't want to reset?</Text>
                    <TouchableOpacity onPress={() => router.push("./login")}>
                        <Text style={styles.signinLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
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
        marginBottom: height * 0.08, // Moved slightly upward
        marginTop: -height * 0.09, // Adjusted to move it up
    },
    label: {
        fontSize: 16,
        alignSelf: "flex-start",
        marginLeft: width * 0.1,
        color: "#9D9D9D",
    },
    Textinput: {
        width: "80%",
        padding: width * 0.04,
        borderRadius: 16,
        marginVertical: height * 0.01,
        borderWidth: 1,
        borderColor: "#E8F1EE",
        backgroundColor: "#E8F1EE",
        fontSize: width * 0.04,
    },
    sendButton: {
        width: "80%",
        backgroundColor: "#2B4B40",
        padding: height * 0.016,
        borderRadius: 30,
        alignItems: "center",
        marginTop: height * 0.02,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerContainer: {
        position: "absolute",
        bottom: height * 0.05,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    signinText: {
        fontSize: width * 0.04,
        color: "#9D9D9D",
    },
    signinLink: {
        color: "#2B4B40",
        fontWeight: "600",
        marginLeft: 5,
    },
});

export default ForgetPassword;
