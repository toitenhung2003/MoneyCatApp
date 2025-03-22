import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Tabs from './navigation/Tabs';
import { NavigationContainer } from '@react-navigation/native';
export default function App() {
  return (
    <NavigationContainer >
      <StatusBar
        backgroundColor= 'white' // Đặt màu nền cho StatusBar
        barStyle="dark-content" // Đặt kiểu chữ (light hoặc dark)
      
      ></StatusBar>
      <Tabs/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
