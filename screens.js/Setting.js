import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal, Button, Provider } from "react-native-paper";

const Setting = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <Provider>
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.header, darkMode && styles.darkText]}>Cài đặt</Text>
        <View style={styles.profileContainer}>
          <Image source={require('../assets/logo_app.png')} style={styles.avatar} />
          <View>
            <Text style={[styles.profileName, darkMode && styles.darkText]}>Admin</Text>
            <Text style={[styles.profileEmail, darkMode && styles.darkText]}>admin@gmail.com</Text>
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

        <TouchableOpacity style={styles.option}>
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
    borderColor:'gray',
    borderWidth:1
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
