import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'

const Setting = () => {
  return (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingTop: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Tiện ích</Text>
      </View>
      <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, borderBottomWidth: 0.1 }}>
        <Image style={{ height: 48, width: 48, marginRight: 10 }} source={require('../assets/catm.png')} />
        <View>
          <Text style={{ fontWeight: 'bold', color: "#4BB242", fontSize: 15 }}>Đức Nè</Text>
          <Text>id:123456789</Text>
        </View>
      </View>
      <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, borderBottomWidth: 0.1 }}>
        <Image style={{ height: 48, width: 48, marginRight: 10 }} source={require('../assets/medal.png')} />
        <View>
          <Text style={{ fontSize: 15 }}>Tài khoản</Text>
          <Text>Miễn phí - Nâng cấp ngay</Text>
        </View>
      </View>
      <View style={{ flex: 0.5 }} />
      <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, borderBottomWidth: 0.1 }}>
        <Image style={{ height: 36, width: 36, marginRight: 20, marginLeft: 9 }} source={require('../assets/vietnam.png')} />
        <View>
          <Text style={{ fontSize: 15 }}>Ngôn Ngữ</Text>
          <Text style={{ fontWeight: '300' }}>Vietnamese</Text>
        </View>
      </View>
      <View style={{ flex: 0.5 }} />
      <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, borderBottomWidth: 0.1 }}>
        <Image style={{ height: 36, width: 36, marginRight: 20, marginLeft: 9 }} source={require('../assets/facebook.png')} />
        <View>
          <Text style={{ fontSize: 15 }}>Về chúng tôi</Text>
        </View>
      </View>
      <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, borderBottomWidth: 0.1 }}>
        <Image style={{ height: 36, width: 36, marginRight: 20, marginLeft: 9 }} source={require('../assets/layers.png')} />
        <View>
          <Text style={{ fontSize: 15 }}>Đổi giao diện</Text>

        </View>
      </View><View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, borderBottomWidth: 0.1 }}>
        <Image style={{ height: 36, width: 36, marginRight: 20, marginLeft: 9 }} source={require('../assets/good-feedback.png')} />
        <View>
          <Text style={{ fontSize: 15 }}>Đánh giá ứng dụng</Text>
        </View>
      </View>
      <View style={{  flex: 3 , justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity style={{width:350, backgroundColor:'white',height:50, borderRadius:25,justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth:0.2}}>
          <Text style={{fontSize:15}}>
            ĐĂNG XUẤT
          </Text>
        </TouchableOpacity>
      </View>

    </View>

  )
}

export default Setting

const styles = StyleSheet.create({})