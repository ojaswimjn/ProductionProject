import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const ResetWithOTP = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendOTP = async () => {
        const response = await fetch('http://yourbackend.com/api/send-otp/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        Alert.alert(response.ok ? 'Success' : 'Error', data.success || data.error);
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const response = await fetch('http://yourbackend.com/api/reset-password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, new_password: newPassword, new_password2: confirmPassword }),
        });

        const data = await response.json();
        Alert.alert(response.ok ? 'Success' : 'Error', data.success || data.error);
    };

    return (
        <View>
            <Text>Enter Email</Text>
            <TextInput value={email} onChangeText={setEmail} />
            <Button title="Send OTP" onPress={handleSendOTP} />

            <Text>Enter OTP</Text>
            <TextInput value={otp} onChangeText={setOtp} />

            <Text>New Password</Text>
            <TextInput secureTextEntry value={newPassword} onChangeText={setNewPassword} />
            <Text>Confirm Password</Text>
            <TextInput secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            <Button title="Reset Password" onPress={handleResetPassword} />
        </View>
    );
};

export default ResetWithOTP;
