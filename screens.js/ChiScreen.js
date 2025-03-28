import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Dialog, Portal, Provider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const ChiScreen = () => {
  const [categories, setCategories] = useState([
    'Ăn uống', 'Chi tiêu', 'Quần áo', 'Mỹ phẩm',
    'Đi chơi', 'Y tế', 'Giáo dục', 'Tiền điện',
    'Đi lại', 'Phí liên quan', 'Tiền nhà', 'Phụ kiện',
    'Khác...'
  ]);
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

  // Xử lý thêm danh mục mới
  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories.slice(0, -1), newCategory, 'Khác...']);
      setSelectedCategory(newCategory);
    }
    setNewCategory('');
    setIsAddDialogVisible(false);
  };
  const handleLongPress = (category) => {
    setSelectedCategory(category);
    setEditedCategory(category);
    setIsDialogVisible(true);
  };

  const handleEditCategory = () => {
    setCategories(categories.map(cat => cat === selectedCategory ? editedCategory : cat));
    setIsDialogVisible(false);
  };
  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => cat !== selectedCategory));
    setIsDialogVisible(false);
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
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
      <View style={styles.container}>
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
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, category === selectedCategory ? styles.selectedCategory : {}]}
              onLongPress={() => handleLongPress(category)}
              onPress={() => {
                if (category === 'Khác...') {
                  setIsAddDialogVisible(true);
                } else {
                  setSelectedCategory(prev => (prev === category ? null : category));
                }
              }}
            >
              <Text style={styles.categoryText}>{truncateText(category)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Portal>
          <Dialog style={{backgroundColor:'white'}} visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
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
        <TouchableOpacity style={styles.submitButton}>
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
              <Button onPress={handleAddCategory}>Thêm</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
    flexGrow:1

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
})