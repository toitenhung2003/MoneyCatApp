import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChiScreen from './ChiScreen';
import ThuScreen from './ThuScreen';
import { ThemeContext } from '../contexts/ThemeContext';
const Home = () => {
  const [activeTab, setActiveTab] = useState("TIỀN CHI");
  const [Category,setCategory] = useState()
  const [token2,setToken]=useState()
    const { darkMode } = useContext(ThemeContext);
  
  var data;

  const getCategoryData = async () => {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      const token = userData.accessToken
      setToken(token)
      await console.log("lấy dữ liệu user thành công");
      console.log("token: ", token);
      
      
      try {
        const response = await fetch('https://test-spending-management.glitch.me/transactions/allCategoryByDate', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "fromDate": "2024-01-10",
            "toDate": "2025-12-20"
          }),
        });

        data = await response.json();
        if (data?.result?.errorCode==1) {
          setCategory()
          
        }else{
          setCategory(data)
          console.log("mục thu chi: ", data);
        }
        
        

      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("Lỗi ở home", error);

      }
      
      
    }
    

  };
  useEffect(() => {
    // 🔥 Lấy dữ liệu từ AsyncStorage khi vào màn hình chính
    
     
    getCategoryData();
  }, []);


  return (
    <View style={[styles.container, {backgroundColor: darkMode ? "#222" : 'white'}]}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "TIỀN CHI" && styles.activeTab]}
          onPress={() => setActiveTab("TIỀN CHI")}
        >
          <Text style={[styles.tabText, activeTab === "TIỀN CHI" && styles.activeTabText]}>
            TIỀN CHI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "TIỀN THU" && styles.activeTab]}
          onPress={() => setActiveTab("TIỀN THU")}
        >
          <Text style={[styles.tabText, activeTab === "TIỀN THU" && styles.activeTabText]}>
            TIỀN THU
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === "TIỀN CHI" ? (
          <ChiScreen CategoryChi ={Category} token={token2} onRefresh={getCategoryData}/>
        ) : (
          <ThuScreen CategoryThu ={Category} token={token2} onRefresh={getCategoryData}/>
        )}
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,

  },
  tabContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: "#D8D2DC", // Màu xám nhạt
  },
  activeTab: {
    backgroundColor: "#EE8E20",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6C6871", // Màu chữ xám nhạt
  },
  activeTabText: {
    color: "#FFFFFF", // Màu chữ trắng khi active
  },
  contentContainer: {
    flex: 1,

  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

