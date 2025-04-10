import React, { useState, useEffect, use } from "react";
import { View, Text, StyleSheet, Switch, Image, Alert, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal, Button, Provider } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  useEffect(() => {
    // 🔥 Lấy dữ liệu từ AsyncStorage khi vào màn hình chính
    const getUserData = async () => {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        await setUser(JSON.parse(storedData)); // Chuyển chuỗi JSON thành object
        console.log("lấy dữ liệu user thành công");
        console.log("user: ", user);


      }
    };

    getUserData();
  }, []);

  const Logout = async () => {
    Alert.alert(
      "Thông báo",
      "Bạn chắc chắn muốn đăng xuất!",
      [
        {
          text: "OK", onPress: () => handleLogout()
        }
      ]
    );


  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    console.log('Đăng xuất thành công ');
    navigation.navigate('DangNhap');
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setSubmitted(false);
    setRating(0);
  };
  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      hideDialog();
    }, 1000);
  };
  //hàm đóng mở dialog đổi mật khẩu
  const showPasswordDialog = () => setPasswordDialogVisible(true);
  const hidePasswordDialog = () => {
    setPasswordDialogVisible(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  //hàm xử lý đổi mật khẩu
  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp.");
      return;
    }

    // Gọi API đổi mật khẩu ở đây nếu có
    Alert.alert("Thành công", "Mật khẩu đã được thay đổi.");
    hidePasswordDialog();
  };

  return (
    <Provider>
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.header, darkMode && styles.darkText]}>Cài đặt</Text>
        <View style={styles.profileContainer}>
          <Image source={require('../assets/logo_app.png')} style={styles.avatar} />
          <View>
            <Text style={[styles.profileName, darkMode && styles.darkText]}>{user?.user?.username}</Text>
            <Text style={[styles.profileEmail, darkMode && styles.darkText]}>{user?.user?._id}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.option}>
          <Icon name="user" size={20} color={darkMode ? "#ff9999" : "#ff4d4d"} />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, darkMode && styles.darkText]}>Account</Text>
            <Text style={[styles.optionSubtitle, darkMode && styles.darkText]}>Security notifications, change number</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.option}>
          <Icon name="adjust" size={20} color="#ffcc00" />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, darkMode && styles.darkText]}>Dark Mode</Text>
            <Text style={[styles.optionSubtitle, darkMode && styles.darkText]}>Change color app</Text>
          </View>
          <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
        </View>

        <TouchableOpacity style={styles.option} onPress={showDialog}>
          <Icon name="star" size={20} color={darkMode ? "#FFD700" : "#000"} />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, darkMode && styles.darkText]}>Rate App</Text>
            <Text style={[styles.optionSubtitle, darkMode && styles.darkText]}>Đánh giá ứng dụng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={()=>navigation.navigate('QuanLyNganSach')}>
          <Icon name="money" size={20} color={darkMode ? "#FFD700" : "#1abc9c"} />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, darkMode && styles.darkText]}>Quản lý ngân sách</Text>
            <Text style={[styles.optionSubtitle, darkMode && styles.darkText]}>Đặt mức chi tiêu hợp lý</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showPasswordDialog} >
          <Icon name="key" size={20} color={darkMode ? "#ddd" : "#000"} />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, darkMode && styles.darkText]}>Đổi mật khẩu</Text>
            <Text style={[styles.optionSubtitle, darkMode && styles.darkText]}>Thay đổi mật khẩu của bạn</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={Logout}>
          <Icon name="sign-out" size={20} color={darkMode ? "#ddd" : "#000"} />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, darkMode && styles.darkText]}>Log in</Text>
            <Text style={[styles.optionSubtitle, darkMode && styles.darkText]}>Đăng xuất khỏi ứng dụng</Text>
          </View>
        </TouchableOpacity>



        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: darkMode ? "#333" : "white" }}>
            <Dialog.Title style={[styles.dialogTitle, darkMode && styles.darkText]}>Đánh giá ứng dụng</Dialog.Title>
            <Dialog.Content>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Icon name={star <= rating ? "star" : "star-o"} size={40} color={star <= rating ? "#FFD700" : "#CCCCCC"} style={styles.starIcon} />
                  </TouchableOpacity>
                ))}
              </View>
              {submitted && <Text style={styles.thankYouText}>Cảm ơn bạn đã đánh giá!</Text>}
            </Dialog.Content>
            <Dialog.Actions>
              {!submitted ? (
                <>
                  <Button onPress={hideDialog}>Hủy</Button>
                  <Button onPress={handleSubmit}>Gửi</Button>
                </>
              ) : null}
            </Dialog.Actions>
          </Dialog>
        </Portal>

       {/* dialog đổi mật khẩu */}
        <Portal>
          <Dialog visible={passwordDialogVisible} onDismiss={hidePasswordDialog} style={{ backgroundColor: darkMode ? "#333" : "#fff" }}>
            <Dialog.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>Thay đổi mật khẩu</Dialog.Title>
            <Dialog.Content>
              <TextInput
                placeholder="Nhập mật khẩu cũ"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                style={{ marginBottom: 10, backgroundColor: "#f1f1f1", borderRadius: 8, padding:10 }}
              />
              <TextInput
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={{ marginBottom: 10, backgroundColor: "#f1f1f1", borderRadius: 8,padding:10 }}
              />
              <TextInput
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{ marginBottom: 10, backgroundColor: "#f1f1f1", borderRadius: 8, padding:10 }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hidePasswordDialog}>Hủy</Button>
              <Button onPress={handleChangePassword}>Lưu</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkText: {
    color: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "orange",
    borderColor: 'gray',
    borderWidth: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    color: "#777",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: "#777",
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  thankYouText: {
    textAlign: "center",
    color: "green",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  starIcon: {
    marginHorizontal: 5,
  },
  dialogTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
