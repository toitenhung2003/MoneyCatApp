import { Alert, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Button, Dialog, Portal, Provider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';

const ChiScreen = ({ CategoryChi, token, onRefresh }) => {
  const { darkMode } = useContext(ThemeContext);
  const [Category, setCategory] = useState({ result: { result: [] } });
  const [categories, setCategories] = useState([
    'Ăn uống', 'Chi tiêu', 'Quần áo', 'Mỹ phẩm',
    'Đi chơi', 'Y tế', 'Giáo dục', 'Tiền điện',
    'Đi lại', 'Phí liên quan', 'Tiền nhà', 'Phụ kiện',
    'Khác...'
  ]);

  // const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  // const [date, setDate] = useState("12/02/2025 (TH 4)");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [idCategory, setIdCategory] = useState('')
  const [loadPage, setLoadPage] = useState(0)
  const [budget, setBudget] = useState(0)
  useEffect(() => {
    // console.log("CategoryChi", CategoryChi);
    // console.log("token: ",token);
    console.log("selectedCategory: ", selectedCategory);
    console.log("idCategory: ", idCategory);
    console.log("CategoryChi: ", CategoryChi);
    // const formattedDate = moment(date).format('YYYY-MM-DD');
    // console.log(formattedDate);
    getCategory()
    getNumber()


  }, [idCategory]);
  const getCategory = async () => {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      const token = userData.accessToken
      const today = new Date();

      // Ngày đầu tiên của tháng
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

      // Ngày cuối cùng của tháng
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);


      const formatFirst = moment(firstDay).format('YYYY-MM-DD');
      const formatLast = moment(lastDay).format('YYYY-MM-DD');

      // console.log("Ngày hôm nay:", formatDate(today));
      console.log("Ngày đầu tháng:", formatFirst);
      console.log("Ngày cuối tháng:", formatLast);
      try {
        const response = await fetch('https://test-spending-management.glitch.me/transactions/allCategoryByDate', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "fromDate": formatFirst,
            "toDate": formatLast
          }),
        });

        data = await response.json();
        if (data.result.errorCode === 1) {
          console.log("chua co khoan chi nao");

          setCategory(Category)
        } else {
          setCategory(data)
        }

        console.log("ngan sach: ", data);


      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);

      }

    }



  }

  const getNumber = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) return;

      const userData = JSON.parse(storedData);
      const userId = userData.user._id
      // Tùy thuộc vào structure userData

      const value = await AsyncStorage.getItem(`@my_number_${userId}`);
      if (value !== null) {
        setBudget(parseFloat(value))
        return parseFloat(value); // chuyển lại thành số
      }

    } catch (e) {
      console.error('Lỗi khi đọc số:', e);
    }

  };

  // Xử lý thêm danh mục mới
  const handleAddCategory = async () => {
    if (newCategory.trim() !== '') {
      try {
        const response = await fetch('https://test-spending-management.glitch.me/categories', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "type": "1",
            "name": newCategory
          }),
        });

        data = await response.json();

        if (onRefresh) {
          await onRefresh(); // Gọi hàm refresh từ component cha

        }

        console.log("Thêm danh muc khoản chi thành công: ", data);


      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);

      }
    }
    setNewCategory('');
    setIsAddDialogVisible(false);
  };
  const totalIncome = (Category?.result?.result || [])
    ? Category.result.result.reduce((total, category) => {
      const incomeInCategory = category.transactions
        ?.filter(transaction => transaction.type === 1)
        ?.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0) || 0;
      return total + incomeInCategory;
    }, 0)
    : 0;

  const handleAddTransactions = async () => {
    const value = parseFloat(amount.replace(/,/g, ''));


    if (note.trim() == '') {
      Alert.alert("Bạn quên chưa điền ghi chú kìa")
      return;
    } else if (amount.trim() == '') {
      Alert.alert("Bạn quên chưa điền tiền chi kìa")
      return;
    } else if (selectedCategory == null) {
      Alert.alert("Bạn chưa chọn danh mục chi kìa")
      return;
    }

    if (budget > 0 && (totalIncome + value > budget)) {
      Alert.alert("BẠN KHÔNG THỂ CHI VƯỢT NGÂN SÁCH !!!!")
      return;
    } else {
      // setLoading(true)

      const formattedDate = moment(date).format('YYYY-MM-DD');
      try {
        const response = await fetch('https://test-spending-management.glitch.me/transactions', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "categoryId": idCategory,
            "type": "1",
            "amount": value,
            "date": formattedDate,
            "description": note
          }),
        });

        data = await response.json();

        if (onRefresh) {
          await onRefresh(); // Gọi hàm refresh từ component cha
        }

        await console.log("Thêm khoản chi thành công: ", data);
        if (data.result.errorCode == 0) {
          setTimeout(() => {
            // setLoading(false);
            setNote('')
            setAmount(0),
              setLoadPage(loadPage + 1)
          }, 3000);
        }


      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);

      }



    }

  }
  const handleLongPress = (category, id) => {
    setSelectedCategory(category);
    setEditedCategory(category);
    setIdCategory(id)
    setIsDialogVisible(true);
  };

  const handleEditCategory = () => {
    setCategories(categories.map(cat => cat === selectedCategory ? editedCategory : cat));
    setIsDialogVisible(false);
  };
  const handleDeleteCategory = async () => {
    try {
      const response = await fetch('https://test-spending-management.glitch.me/categories', {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "categoryId": idCategory,
        }),
      });

      data = await response.json();

      if (onRefresh) {
        await onRefresh(); // Gọi hàm refresh từ component cha
      }

      await console.log("Xóa danh mục: ", data);
      if (data.result.errorCode == 0) {
        setTimeout(() => {
          // setLoading(false);

        }, 3000);
      } else if (data.result.errorCode == 1) {
        Alert.alert("Danh mục đã có trong khoản chi không thể xóa được")
        return;
      }


    } catch (error) {
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
      console.log("error", error);

    }

    setCategories(categories?.filter(cat => cat !== selectedCategory));
    setIsDialogVisible(false);
  };
  const handleDateChange = (event, selectedDate) => {
    // setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const numberToVietnameseWords = (num) => {
    const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
    const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

    const readThreeDigits = (number) => {
      let result = "";
      const hundred = Math.floor(number / 100);
      const ten = Math.floor((number % 100) / 10);
      const unit = number % 10;

      if (hundred > 0) {
        result += `${digits[hundred]} trăm `;
        if (ten === 0 && unit > 0) result += "lẻ ";
      }

      if (ten > 1) {
        result += `${digits[ten]} mươi `;
        if (unit === 5) result += "lăm ";
        else if (unit > 0) result += `${digits[unit]} `;
      } else if (ten === 1) {
        result += "mười ";
        if (unit === 5) result += "lăm ";
        else if (unit > 0) result += `${digits[unit]} `;
      } else if (unit > 0) {
        result += `${digits[unit]} `;
      }

      return result.trim();
    };

    if (num === 0) return "không đồng";

    let words = "";
    let unitIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkWords = readThreeDigits(chunk);
        words = `${chunkWords} ${units[unitIndex]} ${words}`.trim();
      }
      num = Math.floor(num / 1000);
      unitIndex++;
    }

    return words + " đồng";
  };

  const formatVietnameseCurrency = (amount) => {
    if (!amount) return "không đồng";
    const num = parseInt(amount, 10);
    if (isNaN(num)) return "không đồng";
    return numberToVietnameseWords(num);
  };
  const truncateText = (text, maxLength = 9) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: handleDateChange,
      mode: 'date',
      display: 'default',
    });
  };
  return (
    <Provider>
      <SafeAreaView style={[styles.container, {backgroundColor: darkMode ? '#222' : 'white'}]}>
        <View style={{ width: 350, height: '100%' }}>
          <View style={[styles.containerItem, styles.darkContainerItem]}>
            <Text style={[styles.label, darkMode && styles.darklabel]}>Ngày</Text>
            <TouchableOpacity onPress={openDatePicker}>
              <TextInput
                style={[styles.input, ]}
                value={date.toLocaleDateString("vi-VN")}
                editable={false}
              />
            </TouchableOpacity>
          </View>


          <View style={[styles.containerItem,styles.darkContainerItem]}>
            <Text style={[styles.label, darkMode && styles.darklabel]}>Ghi Chú</Text>
            <TextInput
              style={[styles.input,{ backgroundColor: darkMode ? "#222" : 'white', textAlign: 'left', marginBottom: 1, fontWeight: 'normal', fontSize: 18,color: darkMode ? '#eee' : '#333',  }]}
              placeholder="Chưa nhập vào"
              placeholderTextColor={darkMode ? '#eee' : '#333'}
              value={note}
              onChangeText={(txt) => {
                setNote(txt);
              }}

            />
          </View>

          <View style={[styles.containerItem, styles.darkContainerItem]}>
            <Text style={[styles.label, darkMode && styles.darklabel]}>Tiền Chi</Text>
            <TextInput
              style={[styles.input, { textAlign: 'left', marginBottom: 2, backgroundColor: darkMode ? "#222" : 'white', color: darkMode ? 'white' : 'black' }]}
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                // Xóa mọi ký tự không phải số
                const raw = text.replace(/[^0-9]/g, '');

                // Format lại với dấu phẩy
                const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                setAmount(formatted);
              }}
              placeholder='0'
              placeholderTextColor={darkMode ? '#eee' : '#333'}

            />
          </View>
          {/* <Text style={styles.currencyText}>{formatVietnameseCurrency(amount)}</Text> */}

          <Text style={[styles.label, { marginTop: 10 }, darkMode && styles.darklabel]}>Danh Mục</Text>
          <ScrollView contentContainerStyle={[styles.categoryContainer, {backgroundColor: darkMode ? '#333' : '#f1f2f6'}]}>
            {Array.isArray(CategoryChi?.result?.result) && CategoryChi?.result?.result.length > 0 ? (
              CategoryChi?.result?.result.filter(item => item.type == 1).map(item => (
                <View key={item?._id}>
                  <TouchableOpacity
                    style={[styles.categoryButton, item?._id === idCategory ? styles.selectedCategory : {}, {backgroundColor: darkMode ? '#222' : 'white'}]}
                    onLongPress={() => handleLongPress(item?.category, item?._id)}
                    onPress={() => {
                      if (categories === 'Khác...') {
                        setIsAddDialogVisible(true);
                      } else {
                        setSelectedCategory(prev => (prev === item?.category ? null : item?.category));
                        setIdCategory(prev => (prev === item?._id ? null : item?._id))
                      }
                    }}
                  >
                    <Text style={[styles.categoryText, {color: darkMode ? 'white' : 'black'}]}>{truncateText(item?.category)}</Text>

                  </TouchableOpacity>

                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, {color: darkMode ? 'white' : 'black'}]}>Không có dữ liệu</Text>
            )}

          </ScrollView>

          <TouchableOpacity
            // key={0}
            style={[styles.categoryButton, styles.selectedCategory, {backgroundColor: darkMode ? '#333' : 'white'}]}
            // onLongPress={() => handleLongPress(item.category)}
            onPress={() => {
              // if (categories === 'Khác...') {
              setIsAddDialogVisible(true);
              // } else {
              //   setSelectedCategory(prev => (prev === item.category ? null : item.category));
              // }
            }}
          >
            <Text style={[styles.categoryText, {color: darkMode ? 'white': 'black'}]}>{("Thêm danh mục")}</Text>

          </TouchableOpacity>
          <Portal>
            <Dialog style={{ backgroundColor: 'white' }} visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
              <Dialog.Title>Xóa danh mục</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  style={styles.inputD}
                  value={editedCategory}
                  onChangeText={setEditedCategory}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setIsDialogVisible(false)}>Hủy</Button>
                <Button onPress={handleDeleteCategory} color="red">Xóa</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <TouchableOpacity style={styles.submitButton} onPress={handleAddTransactions}>
            <Text style={styles.submitText}>NHẬP KHOẢN CHI</Text>
          </TouchableOpacity>
          <Portal>
            <Dialog style={{ backgroundColor: 'white' }} visible={isAddDialogVisible} onDismiss={() => setIsAddDialogVisible(false)}>
              <Dialog.Title style={{ fontWeight: 'bold' }}>Thêm danh mục</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  style={styles.inputD}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="Nhập danh mục mới"
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setIsAddDialogVisible(false)}>Hủy</Button>
                <Button onPress={handleAddCategory} >Thêm</Button >
              </Dialog.Actions>
            </Dialog>
          </Portal>

          {/* {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        )} */}
        </View>
      </SafeAreaView>
    </Provider>
  )
}

export default ChiScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,

  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
  },
  darklabel:{
    color:'white'
  },
  input: {
    backgroundColor: "#ffeaa7",
    padding: 5,
    borderRadius: 5,
    fontWeight: 'bold',
    width: 300,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 10,
    color:'black'

  },
  inputA: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    fontSize: 20,
    fontWeight: 'bold'
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 2,
    flexGrow: 1,
    marginTop: 15

  },
  categoryButton: {
    backgroundColor: 'white',
    padding: 11,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',

  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#EE8E20'
  },
  categoryText: {
    color: "black",
    fontSize: 15,
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: "#EE8E20",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  currencyText: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  containerItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 6,
    paddingTop: 5,
  },
  darkContainerItem:{
    borderBottomColor: '#eee',

  }
  ,

  inputD: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#dcdde1',
    color: 'black',
    fontSize: 15
  }
})