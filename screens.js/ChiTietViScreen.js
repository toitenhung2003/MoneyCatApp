import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';



const ChiTietViScreen = () => {
  const route = useRoute();
  const { wallet } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [isCompleted, setIsCompleted] = useState(wallet.current >= wallet.target); // 
  const { darkMode } = useContext(ThemeContext);
  const [Category, setCategory] = useState({ result: { result: [] } });



  useEffect(() => {

    getContri()
  }, []);

  const getContri = async () => {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      const token = userData.accessToken;

      try {
        const response = await fetch(`https://test-spending-management.glitch.me/savingContributions/${wallet._id}`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },


        });

        const data = await response.json();
        if (data.result.result.length === 0) {
          console.log("Không có giao dịch");
          setCategory(Category)
        }
        else {
          setCategory(data);
        }

        console.log("hóa đơn: ", data);

      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);
      }
    }
  };


  const handleAdd = async () => {
    const value = parseFloat(amount.replace(/,/g, ''));


    if (!value || value <= 0 || isCompleted) return;

    const remaining = wallet.targetAmount - wallet.currentAmount; //  số còn thiếu

    if (value > remaining) { //  kiểm tra nếu nhập vượt
      Alert.alert(
        '⚠️ Vượt quá mục tiêu!',
        `Bạn chỉ cần thêm tối đa ${remaining.toLocaleString('vi-VN')}đ để đạt mục tiêu.`,
      );
      return; //  không cho thêm
    }

    const storedData = await AsyncStorage.getItem('userData');

    if (storedData) {
      const userData = JSON.parse(storedData);
      const token = userData.accessToken;

      try {

        const response = await fetch('https://test-spending-management.glitch.me/savingContributions/', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "savingGoalId": wallet._id,
            "amount":value,
            "note": "Ghi chú của giao dịch"
          }),
        });

        const data = await response.json();
        if (data.result.errorCode === 1) {

          Alert.alert(" Thêm không thành công")
        } else {
          // wallet.onGoBack()

          getContri()
        }
      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);
      }
    }


    // const newEntry = {
    //   id: Date.now().toString(),
    //   date: new Date().toLocaleDateString('vi-VN'),
    //   amount: value,
    // };

    const newAmount = wallet.currentAmount + value;

    // setHistory([newEntry, ...history]);
    wallet.currentAmount = newAmount;
    setAmount('');

    if (newAmount >= wallet.targetAmount) {
      setIsCompleted(true);
      Alert.alert('🎉 Chúc mừng!', 'Bạn đã hoàn thành mục tiêu tiết kiệm!');
    }
  };



  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#222' : '#ffffff' }}>
      <View style={styles.header} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={22} color={darkMode ? 'white' : "#000"} />
      </TouchableOpacity>
      <Image source={require('../assets/banner_save.jpg')} style={styles.banner} />

      <View style={[styles.body, { backgroundColor: darkMode ? '#222' : 'white' }]}>
        <Text style={[styles.title, { color: darkMode ? 'white' : 'black' }]}>{wallet.name}</Text>
        <Text style={[styles.target, { color: darkMode ? 'white' : 'black' }]}>
          <Text style={{ fontWeight: 'bold' }}>{wallet.currentAmount.toLocaleString('vi-VN')}</Text> / {wallet.targetAmount.toLocaleString('vi-VN')}đ
        </Text>


        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${(wallet.currentAmount / wallet.targetAmount) * 100}%` }]} />
        </View>

        <TextInput
          style={[styles.input, isCompleted && { backgroundColor: '#eee' }, { backgroundColor: darkMode ? '#333' : 'white' }, { color: darkMode ? 'white' : 'black' }]}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          value={amount}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onChangeText={(text) => {
            // Xóa mọi ký tự không phải số
            const raw = text.replace(/[^0-9]/g, '');

            // Format lại với dấu phẩy
            const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            setAmount(formatted);
          }}
          editable={!isCompleted} //  không cho nhập nếu hoàn thành
        />
        <TouchableOpacity
          style={[styles.button, isCompleted && { backgroundColor: '#ccc' }]} //  làm mờ nút nếu hoàn thành
          onPress={handleAdd}
          disabled={isCompleted} //  vô hiệu hóa nút nếu hoàn thành
        >
          <Text style={styles.buttonText}>Nhập số tiền</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: darkMode ? '#333' : '#ecf0f1', padding: 10, height: "32%", borderRadius: 10, marginBottom: 10, }}>
          <Text style={[styles.historyTitle, { color: darkMode ? 'white' : 'black' }]}>Lịch sử tiết kiệm</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Category?.result?.result}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={[styles.historyItem, { backgroundColor: darkMode ? '#333' : 'white' }]}>
                <Text style={{ color: darkMode ? 'white' : 'black' }}>{moment(item.date).format('YYYY-MM-DD')}</Text>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>+{item.amount.toLocaleString('vi-VN')}đ</Text>
              </View>
            )}
          />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {

    backgroundColor: 'red'

  },
  body: {
    backgroundColor: '#fff',
    padding: 16,
    height: '100%'

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  target: {
    marginVertical: 10,
  },
  progressBackground: {
    height: 15,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  progressFill: {
    height: 15,
    backgroundColor: '#FF8000',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 20
  },
  button: {
    backgroundColor: '#F7941D',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  banner: {
    height: "30%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 10,
    resizeMode: 'contain',
    width: '100%'
  },
  backButton: {
    margin: '5%',
  },
});

export default ChiTietViScreen;
