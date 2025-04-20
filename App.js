import { StatusBar } from 'react-native';
import Tabs from './navigation/Tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // Lấy user từ AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          console.log("thông tin: ",);
          
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Lỗi khi load user:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  
  // Chờ load user xong mới render ThemeProvider
  if (loading) return null; // hoặc màn hình loading

  return (
    <ThemeProvider userId={user?.user?._id}>
      <MainApp />
    </ThemeProvider>
  );
}

const MainApp = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={darkMode ? '#121212' : '#ffffff'}
        barStyle={darkMode ? 'light-content' : 'dark-content'}
      />
      <Tabs />
    </NavigationContainer>
  );
};
