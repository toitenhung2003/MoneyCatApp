import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DangNhap = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const LoginButton = async () => {
        if (!email) {
            Alert.alert("Hãy nhập Email");
            return;
        } else if (!password) {
            Alert.alert("Hãy nhập Password");
            return;
        }

        try {
            const response = await fetch('https://test-spending-management.glitch.me/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username":email,
                    "password":password,
                }),
            });

            const data = await response.json();
            const username = "Username not found!"
            const passfail = "Password incorrect"
            console.log(data.result.result);
            if(data.result.result==username){
                Alert.alert("Email không chính xác")
                console.log("emailfail: ",data.result.result);
                
                return;
            } else if(data.result.result==passfail){
                Alert.alert("Password không chính xác")
                console.log("passfail: ",data.result.result);
                return;
            }else if(data.result.errorCode==0){
                // Alert.alert("Đăng nhập thành công")
                const storedData = await AsyncStorage.getItem('userData');
                if(storedData==null){
                    await AsyncStorage.setItem('userData', JSON.stringify(data.result.result));
                    console.log("Thêm dữ liệu thành công");
                    setEmail('')
                    setPassword('')
                    navigation.navigate('ManhinhChinh')
                }else{
                    await AsyncStorage.removeItem('userData');
                    await AsyncStorage.setItem('userData', JSON.stringify(data.result.result));
                    console.log("Thêm dữ liệu thành công");
                    setEmail('')
                    setPassword('')
                    navigation.navigate('ManhinhChinh')
                }
                
            }
            

            // if (response.ok) {
            //     Alert.alert("Đăng nhập thành công!", data);
            // } else {
            //     Alert.alert("Lỗi đăng nhập", data.error || "Có lỗi xảy ra");
            // }
            
            
        } catch (error) {
            Alert.alert("Lỗi Đăng Nhập", "Không thể kết nối đến server!");
            Alert.alert("error", error);
            console.log("error", error);
            
        }
        //   ()=>
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>
            <Text style={styles.subtitle}>Chào Mừng Bạn Quay Trở Lại !</Text>
            <Image source={require("../assets/logo_app.png")} style={{ height: 100, width: 100 }} />

            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Mật khẩu"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.forgotPassword}
                onPress={() => navigation.navigate('QuenMatKhau')}
            >
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={LoginButton}
            >
                <Text style={styles.loginButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('DangKi')}
            >
                <Text style={styles.createAccount}>Tạo tài khoản mới</Text>

            </TouchableOpacity>

            <Text style={styles.orContinue}>Or continue with</Text>

            <View style={styles.socialIcons}>
                <FontAwesome name="google" size={32} color="black" style={styles.icon} />
                <FontAwesome name="facebook" size={32} color="black" style={styles.icon} />
                <FontAwesome name="apple" size={32} color="black" style={styles.icon} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF8000',
        marginBottom: '2%',
        marginTop: '10%'
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: '2%',
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#FF8000',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 10,
    },

    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: '10%',
    },
    forgotText: {
        color: '#FF8000',
        fontSize: 14,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#FF8000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    createAccount: {
        fontSize: 14,
        color: '#333',
        marginBottom: '55%',
        fontWeight: 'bold'
    },
    orContinue: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        marginHorizontal: 25,
    },
});

export default DangNhap;