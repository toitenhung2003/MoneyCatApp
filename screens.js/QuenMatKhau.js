import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

const QuenMatKhau = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (email.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn!");
      return;
    }
    Alert.alert("Thành công", "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <Text style={styles.subtitle}>Nhập email để đặt lại mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuenMatKhau;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF8000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#FF8000",
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#FF8000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backText: {
    fontSize: 16,
    color: "#FF8000",
    fontWeight: "bold",
  },
});
