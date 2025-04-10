import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DangKi = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePass, setRePass] = useState('')
    const navigation = useNavigation();
    const RengButton = async () => {
        if (!email) {
            Alert.alert("Hãy nhập Email");
            return;
        } else if (!password) {
            Alert.alert("Hãy nhập Password");
            return;
        }else if(rePass!==password){
            Alert.alert("Password nhập lại chưa đúng");
            return;
        }

        try {
            const response = await fetch('https://test-spending-management.glitch.me/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username": email,
                    "password": password,
                    "name": "this_is_your_name"
                }),
            });

            const data = await response.json();
            console.log(data.result.result);
            if (data.result.errorCode == 1) {
                Alert.alert("Email đã tồn tại")
                console.log("emailfail: ", data.result.result);

                return;
            } else if (data.result.errorCode == 0) {
                Alert.alert(
                    "Thông báo",
                    "Bạn đã đăng ký thành công!",
                    [
                        {
                            text: "OK", onPress: () => {
                                setEmail('');  // Xóa email
                                setPassword('');  // Xóa password
                                navigation.navigate('DangNhap')
                            }
                        }
                    ]
                );
            }




        } catch (error) {
            Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
            console.log("error", error);

        }
        //   ()=>
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tạo Tài Khoản</Text>
            <Text style={styles.subtitle}>Tạo tài khoản mới để quản lý chi tiêu hiệu quả ngay bây giờ!</Text>
            <Image source={require("../assets/coin.png")} style={{ height: 100, width: 100 }} />

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
            <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#999"
                secureTextEntry
                value={rePass}
                onChangeText={setRePass}
            />
            <TouchableOpacity
                style={styles.loginButton}
                onPress={RengButton}

            >
                <Text style={styles.loginButtonText}>Đăng Ký</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('DangNhap')}
            >
                <Text style={styles.createAccount}>Bạn đã có tài khoản?</Text>
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
        fontWeight: 'bold',
        textAlign: 'center'
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
        marginTop: 20
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    createAccount: {
        fontSize: 14,
        color: '#333',
        marginBottom: '39.5%',
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

export default DangKi;