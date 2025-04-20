import { View, Text, Image,StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect, useState } from 'react'
import Home from '../screens.js/Home';
import Chat from '../screens.js/Chat';
import Search from '../screens.js/Search';
import Post from '../screens.js/Post';
import Setting from '../screens.js/Setting';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManHinhChao from '../screens.js/ManHinhChao';
import DangNhap from '../screens.js/DangNhap';
import DangKi from '../screens.js/DangKi';
import QuenMatKhau from '../screens.js/QuenMatKhau';
import QuanLyNganSach from '../screens.js/QuanLyNganSach';
import Save from '../screens.js/Save';
import ChiTietViScreen from '../screens.js/ChiTietViScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
const Tab = createBottomTabNavigator();
const StackMain = createNativeStackNavigator();



function Menu() {
    const { darkMode } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle:{
                    backgroundColor: darkMode ? '#121212' : '#ffffff',
                },
                tabBarShowLabel: false, headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let sizeAdd;
                    if (route.name === 'Wallet') {
                        iconName = focused

                            ? require('../assets/icon_writeS.png')
                            : require('../assets/icon_writeG.png');
                    } else if (route.name === 'Calendar') {
                        iconName = focused
                            ? require('../assets/icon_calenderS.png')
                            : require('../assets/icon_calenderG.png');

                    } else if (route.name === 'Statistical') {
                        iconName = focused
                            ? require('../assets/icon_pieS.png')
                            : require('../assets/icon_pieG.png');

                    } else if (route.name === 'Save') {
                        iconName = focused
                            ? require('../assets/icon_saveS.png')
                            : require('../assets/icon_saveG.png');

                    } else if (route.name === 'Setting') {
                        iconName = focused
                            ? require('../assets/icon_settingS.png')
                            : require('../assets/icon_settingG.png');

                    }

                    // You can return any component that you like here!
                    return <Image source={iconName} style={{ height: 24, width: 24 }} />;
                    ;
                },
                tabBarHideOnKeyboard: true
            })}
        >
            <Tab.Screen name='Wallet' component={Home} />
            <Tab.Screen name='Calendar' component={Chat} />
            <Tab.Screen name='Statistical' component={Search} />
            <Tab.Screen name='Save' component={Save} />
            <Tab.Screen name='Setting' component={Setting} />

        </Tab.Navigator>
    )
}

const Tabs = () => {
    const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Trạng thái chờ

    useEffect(() => {
        const getNumber = async () => {
            try {
                const storedData = await AsyncStorage.getItem('userData');
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    const userId = userData?.user?._id || '';
                    if (userId.trim() !== '') {
                        setId(userId);
                    }
                }
            } catch (e) {
                console.error('Lỗi khi đọc userData:', e);
            } finally {
                setIsLoading(false); // Đánh dấu đã load xong
            }
        };

        getNumber();
    }, []);

    // Trong lúc loading, không render Stack
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={require("../assets/merged_image.png")} style={styles.image} />
            </View>
        );
    }

    return (
        <StackMain.Navigator initialRouteName={id ? 'ManhinhChinh' : 'ManHinhChao'}>
            <StackMain.Screen name='ManhinhChinh' component={Menu} options={{ headerShown: false }} />
            <StackMain.Screen name="ManHinhChao" component={ManHinhChao} options={{ headerShown: false }} />
            <StackMain.Screen name="DangNhap" component={DangNhap} options={{ headerShown: false }} />
            <StackMain.Screen name="DangKi" component={DangKi} options={{ headerShown: false }} />
            <StackMain.Screen name="QuenMatKhau" component={QuenMatKhau} options={{ headerShown: false }} />
            <StackMain.Screen name="QuanLyNganSach" component={QuanLyNganSach} options={{ headerShown: false }} />
            <StackMain.Screen name="ChiTietViScreen" component={ChiTietViScreen} options={{ headerShown: false }} />
        </StackMain.Navigator>
    );
};
export default Tabs;
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
