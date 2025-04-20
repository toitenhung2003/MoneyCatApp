import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children, userId }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      if (!userId) return;
      console.log('Theme loaded for user:', userId)
      try {
        const stored = await AsyncStorage.getItem(`darkMode_${userId}`);
        if (stored !== null) {
          setDarkMode(JSON.parse(stored));
          
        } else {
          // Nếu chưa có thì mặc định tắt darkMode
          setDarkMode(false);
          await AsyncStorage.setItem(`darkMode_${userId}`, JSON.stringify(false));
        }
      } catch (error) {
        console.error('Lỗi khi load dark mode:', error);
      }
    };

    loadTheme();
  }, [userId]);

  const toggleDarkMode = async () => {
    try {
      const newValue = !darkMode;
      setDarkMode(newValue);
      await AsyncStorage.setItem(`darkMode_${userId}`, JSON.stringify(newValue));
    } catch (error) {
      console.error('Lỗi khi lưu dark mode:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
