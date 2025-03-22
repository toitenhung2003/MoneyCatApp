import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import ChiScreen from './ChiScreen';
import ThuScreen from './ThuScreen';

const Home = () => {
  const [activeTab, setActiveTab] = useState("TIỀN CHI");
  return (
    <View style={styles.container}>
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
          <ChiScreen/>
        ) : (
          <ThuScreen/>
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
    paddingTop: 40,
    
  },
  tabContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#D8D2DC", // Màu xám nhạt
  },
  activeTab: {
    backgroundColor: "#413C40", // Màu xám đậm
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

