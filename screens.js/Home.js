import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{  flex: 1, flexDirection: 'row',marginTop:30 }}>
        <View style={{  margin: 10, flexDirection: 'column', paddingLeft:20 }}>
          <Text>Chi tiêu cá nhân</Text>
          <Text style={{ fontWeight: 'bold', color: "#4BB242" }}>500,000đ</Text>
        </View>
        <View style={{  margin: 10, flexDirection: 'column', flex: 1, paddingLeft:20 }}>
          <Text>2025</Text>
          <Text>Tháng 2</Text>
        </View>
      </View>
      <View style={{  flex: 5 }}>
        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ height: 120, width: 120 }} source={require('../assets/catm.png')} />
          <Text >Không có ghi chép nào</Text>
        </View>
        <View style={{  flex: 1 ,justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{ height: 64, width: 64 }} source={require('../assets/plus.png')} />
        </View>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})

