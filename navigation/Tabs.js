import { View, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
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
const Tab = createBottomTabNavigator();
const StackMain = createNativeStackNavigator();
function Menu() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false, headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let sizeAdd;
                    if (route.name === 'Wallet') {
                        iconName = focused

                            ? require('../assets/icon_writeS.png')
                            : require('../assets/icon_write.png');
                    } else if (route.name === 'Calendar') {
                        iconName = focused
                            ? require('../assets/icon_calenderS.png')
                            : require('../assets/icon_calender.png');

                    } else if (route.name === 'Statistical') {
                        iconName = focused
                            ? require('../assets/icon_pieS.png')
                            : require('../assets/icon_pie.png');

                    } else if (route.name === 'Setting') {
                        iconName = focused
                            ? require('../assets/icon_settingS.png')
                            : require('../assets/icon_setting.png');

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
            <Tab.Screen name='Setting' component={Setting} />

        </Tab.Navigator>
    )
}
const Tabs = () => {
    return (
        <StackMain.Navigator initialRouteName='ManHinhChao'>
            <StackMain.Screen name = 'ManhinhChinh' component={Menu} options={{headerShown: false}}/>
            <StackMain.Screen name = "ManHinhChao" component={ManHinhChao} options={{headerShown: false}}/>
            <StackMain.Screen name = "DangNhap" component={DangNhap} options={{headerShown: false}}/>
            <StackMain.Screen name = "DangKi" component={DangKi} options={{headerShown: false}}/>
            <StackMain.Screen name = "QuenMatKhau" component={QuenMatKhau} options={{headerShown: false}}/>
            <StackMain.Screen name = "QuanLyNganSach" component={QuanLyNganSach} options={{headerShown: false}}/>

        </StackMain.Navigator>
    )
}
export default Tabs;