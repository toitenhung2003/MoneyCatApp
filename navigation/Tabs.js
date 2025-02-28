import { View, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import Home from '../screens.js/Home';
import Chat from '../screens.js/Chat';
import Search from '../screens.js/Search';
import Post from '../screens.js/Post';
import Setting from '../screens.js/Setting';
const Tab = createBottomTabNavigator();
const Tabs = () =>{
    return(
        <Tab.Navigator
            // tabBarOptions={{
            //     // showLable:false,
            //     // style:{
            //     //     position:'absolute',
            //     //     bottom:25,
            //     //     left:20,
            //     //     right:20,
            //     //     elevation:0,
            //     //     backgroundColor:'#ffffff',
            //     //     borderRadius:15,
            //     //     height:90,

            //     // }
                
            // }}

            screenOptions={({ route }) => ({
                tabBarShowLabel: false,headerShown:false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let sizeAdd;
                    if (route.name === 'Wallet') {
                        iconName = focused

                            ? require('../assets/wallet_in.png')
                            : require('../assets/wallet_out.png');
                    } else if (route.name === 'Calendar') {
                        iconName = focused
                            ? require('../assets/calendar.png')
                            : require('../assets/calendar.png');

                    } else if (route.name === 'Statistical') {
                        iconName = focused
                            ? require('../assets/pie-chart_in.png')
                            : require('../assets/pie-chart_out.png');

                    } else if (route.name === 'Setting') {
                        iconName = focused
                            ? require('../assets/setting_in.png')
                            : require('../assets/settings_out.png');

                    } 

                    // You can return any component that you like here!
                    return <Image source={iconName} style={{ height: 24, width: 24 }} />;
                    ;
                },
                tabBarHideOnKeyboard:true
            })}
        >
            <Tab.Screen name='Wallet' component={Home}/>
            <Tab.Screen name='Calendar' component={Chat}/>
            <Tab.Screen name='Statistical' component={Search}/>
            <Tab.Screen name='Setting' component={Setting}/>

        </Tab.Navigator>
    )
}
export default Tabs;