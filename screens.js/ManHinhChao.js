import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const ManHinhChao = () => {
  const [isLoginPressed, setIsLoginPressed] = useState(false);
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require("../assets/merged_image.png")} style={styles.image} />
      <Text style={styles.title}>Tiết kiệm thông minh, chi tiêu khôn ngoan!</Text>
      <Text style={styles.subtitle}>Từng đồng đều quan trọng, hãy sử dụng đúng cách!</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonHover]}
          onPressIn={() => setIsLoginPressed(true)}
          onPressOut={() => setIsLoginPressed(false)}
          onPress={()=>navigation.navigate("DangNhap")}
          
        >
          <Text style={[styles.buttonText, isLoginPressed && styles.buttonTextHover]}>Đăng Nhập</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonHover]}
          onPressIn={() => setIsRegisterPressed(true)}
          onPressOut={() => setIsRegisterPressed(false)}
          onPress={()=>navigation.navigate("DangKi")}

        >
          <Text style={[styles.buttonText, isRegisterPressed && styles.buttonTextHover]}>Đăng Kí</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ManHinhChao;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: '5%',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF8000",
    textAlign: "center",
  },
  subtitle: {
    marginTop:15,
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: '30%',
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#f1f2f6",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  buttonHover: {
    backgroundColor: "#FF8000",
  },
  buttonText: {
    color: "#FF8000",
    fontWeight: "bold",
    fontSize:16
  },
  buttonTextHover: {
    color: "#fff",
  },
});
