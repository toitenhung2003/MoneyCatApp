import { Alert, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Dialog, Portal, Provider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';

const ChiScreen = ({ CategoryChi, token, onRefresh }) => {
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
  useEffect(() => {
    // console.log("CategoryChi", CategoryChi);
    // console.log("token: ",token);
    console.log("selectedCategory: ", selectedCategory);
    console.log("idCategory: ", idCategory);
    console.log("CategoryChi: ", CategoryChi);
    // const formattedDate = moment(date).format('YYYY-MM-DD');
    // console.log(formattedDate);


  }, [idCategory]);

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

  const handleAddTransactions = async () => {


    if (note.trim() == '') {
      Alert.alert("Bạn quên chưa điền ghi chú kìa")
      return;
    } else if (amount.trim() == '') {
      Alert.alert("Bạn quên chưa điền tiền chi kìa")
      return;
    } else if (selectedCategory == null) {
      Alert.alert("Bạn chưa chọn danh mục chi kìa")
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
            "amount": amount,
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
      <SafeAreaView style={styles.container}>
        <View style={{width:350, height:'100%'}}>
        <Text style={styles.label}>NGÀY</Text>
        <TouchableOpacity onPress={openDatePicker}>
          <TextInput
            style={[styles.input, { color: 'black' }]}
            value={date.toLocaleDateString("vi-VN")}
            editable={false}
          />
        </TouchableOpacity>


        <Text style={styles.label}>GHI CHÚ</Text>
        <TextInput
          style={styles.input}
          placeholder="Chưa nhập vào"
          value={note}
          onChangeText={(txt) => {
            setNote(txt);
          }}

        />

        <Text style={styles.label}>TIỀN CHI</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={txt => {
            if (txt === "" || /^[1-9]\d*$/.test(txt)) {
              setAmount(txt);
            }
          }}
        />
        <Text style={styles.currencyText}>{formatVietnameseCurrency(amount)}</Text>

        <Text style={styles.label}>DANH MỤC</Text>
        <ScrollView contentContainerStyle={styles.categoryContainer}>
          {Array.isArray(CategoryChi?.result?.result) && CategoryChi?.result?.result.length > 0 ? (
            CategoryChi?.result?.result.filter(item => item.type == 1).map(item => (
              <View key={item?._id}>
                <TouchableOpacity
                  style={[styles.categoryButton, item?._id === idCategory ? styles.selectedCategory : {}]}
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
                  <Text style={styles.categoryText}>{truncateText(item?.category)}</Text>

                </TouchableOpacity>

              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Không có dữ liệu</Text>
          )}

        </ScrollView>

        <TouchableOpacity
          // key={0}
          style={[styles.categoryButton, styles.selectedCategory]}
          // onLongPress={() => handleLongPress(item.category)}
          onPress={() => {
            // if (categories === 'Khác...') {
            setIsAddDialogVisible(true);
            // } else {
            //   setSelectedCategory(prev => (prev === item.category ? null : item.category));
            // }
          }}
        >
          <Text style={styles.categoryText}>{("Thêm danh mục")}</Text>

        </TouchableOpacity>
        <Portal>
          <Dialog style={{ backgroundColor: 'white' }} visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>Chỉnh sửa danh mục</Dialog.Title>
            <Dialog.Content>
              <TextInput
                style={styles.input}
                value={editedCategory}
                onChangeText={setEditedCategory}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>Hủy</Button>
              <Button onPress={handleEditCategory}>Lưu</Button>
              <Button onPress={handleDeleteCategory} color="red">Xóa</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <TouchableOpacity style={styles.submitButton} onPress={handleAddTransactions}>
          <Text style={styles.submitText}>NHẬP KHOẢN CHI</Text>
        </TouchableOpacity>
        <Portal>
          <Dialog visible={isAddDialogVisible} onDismiss={() => setIsAddDialogVisible(false)}>
            <Dialog.Title>Thêm danh mục</Dialog.Title>
            <Dialog.Content>
              <TextInput
                style={styles.input}
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
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 2,
    flexGrow: 1

  },
  categoryButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',

  },
  selectedCategory: {
    borderWidth: 2.5,
    borderColor: '#EE8E20'
  },
  categoryText: {
    color: "black",
    fontSize: 14,
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
})