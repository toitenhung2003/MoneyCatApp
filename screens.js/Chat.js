import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Chat = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [Category, setCategory] = useState()
  const [token2, setToken] = useState()

  const getCategoryData = async () => {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      const token = userData.accessToken
      setToken(token)
      await console.log("lấy dữ liệu user thành công");
      console.log("token: ", token);


      try {
        const response = await fetch('https://test-spending-management.glitch.me/transactions/allCategoryByDate', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "fromDate": selectedDate,
            "toDate": selectedDate
          }),
        });

        data = await response.json();
        setCategory(data)
        console.log("thống kê ngày: ", data);


      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);

      }


    }


  };
  useEffect(() => {
    if (selectedDate) {
      getCategoryData();
      calculateTotals();
    }
  }, [selectedDate]);

  // state lưu giao dịch
  const [transactions, setTransactions] = useState(
    {
      "2025-03-16": [
        { category: "Y tế", description: "Mua cắt móng tay", amount: -20000 },
        { category: "Ăn uống", description: "Mua cà phê", amount: -30000 },
        { category: "Giải trí", description: "Mua vé xem phim", amount: -120000 },
        { category: "Di chuyển", description: "Tiền xăng", amount: -50000 },
        { category: "Mua sắm", description: "Mua sách", amount: -80000 },
        { category: "Y tế", description: "Mua thuốc cảm", amount: -25000 },
        { category: "Lương", description: "Mua thuốc cảm", amount: 6000000 },
      ],
      "2025-03-17": [
        { category: "Y tế", description: "Mua cắt móng tay", amount: -20000 },
        { category: "Ăn uống", description: "Mua cà phê", amount: -30000 },
        { category: "Giải trí", description: "Mua vé xem phim", amount: -120000 },
        { category: "Di chuyển", description: "Tiền xăng", amount: -50000 },
        { category: "Mua sắm", description: "Mua sách", amount: -80000 },
        { category: "Y tế", description: "Mua thuốc cảm", amount: -25000 },
        { category: "Lương", description: "Mua thuốc cảm", amount: 6000000 },
      ],
      "2025-03-11": [
        { category: "Y tế", description: "Mua cắt móng tay", amount: -20000 },
        { category: "Ăn uống", description: "Mua cà phê", amount: -30000 },
        { category: "Giải trí", description: "Mua vé xem phim", amount: -120000 },
        { category: "Di chuyển", description: "Tiền xăng", amount: -50000 },
        { category: "Mua sắm", description: "Mua sách", amount: -80000 },
        { category: "Y tế", description: "Mua thuốc cảm", amount: -25000 },
        { category: "Lương", description: "Mua thuốc cảm", amount: 6000000 },
      ],


    });


  //  Hàm tính tổng thu nhập, chi tiêu, tổng số dư

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    // Kiểm tra xem Category?.result?.result có phải là mảng không
    if (Array.isArray(Category?.result?.result)) {
      Category.result.result.forEach(item => {
        if (item.type == 1)  totalExpense+= item.totalIncome;
        if (item.type == 0) totalIncome += item.totalExpense;
      });
    } else {
      console.log("Category.result.result is not an array:", Category?.result?.result);
    }

    console.log("totalIncome:", totalIncome);
    console.log("totalExpense:", totalExpense);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  };

  const { totalIncome, totalExpense, balance } = calculateTotals();

  // console.log("totalIncome", totalIncome);

  const handleDeleteItem = async(id)=>{
    Alert.alert(
      "Xác nhận xóa", // Tiêu đề
      "Bạn có chắc chắn muốn xóa mục này?", // Nội dung
      [
        { text: "Hủy", onPress: () => console.log("Hủy bỏ"), style: "cancel" }, // Nút Hủy
        { text: "Xóa", onPress: () => deleteItem(id) } // Nút Xóa
      ],
      { cancelable: true } // Cho phép đóng alert khi nhấn ngoài
    );

    



  }

  const deleteItem = async (id)=>{
    
    
    try {
      const response = await fetch('https://test-spending-management.glitch.me/transactions', {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token2}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "transactionId": id
        }),
      });

      data = await response.json();
      
      if (data?.result?.errorCode==0) {
        console.log("Xóa thành công ");
        getCategoryData()
        
      }


    } catch (error) {
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
      console.log("error", error);

    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch</Text>
      <Calendar
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#000",
          dayTextColor: "#000",
          todayTextColor: "#1E90FF",
          selectedDayTextColor: "#000",
          monthTextColor: "#000",
          arrowColor: "#000",
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}

        // Đánh dấu ngày có giao dịch
        markedDates={{
          ...Object.keys(transactions).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: "red" };
            return acc;
          }, {}),
        }}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.incomeText}>Thu nhập</Text>
          <Text style={styles.incomeAmount}>{totalIncome.toLocaleString()}đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.expenseText}>Chi tiêu</Text>
          <Text style={styles.expenseAmount}>{totalExpense.toLocaleString()}đ</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.totalText}>Tổng</Text>
          <Text style={styles.totalAmount}>{balance.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* Hiển thị chi tiết giao dịch khi chọn ngày */}
      {selectedDate && (
        <View style={styles.transactionContainer}>
          <Text style={styles.selectedDate}>{selectedDate} ({new Date(selectedDate).toLocaleDateString("vi-VN", { weekday: "long" })})</Text>

          <ScrollView contentContainerStyle={styles.scrollView}>
            {totalIncome == 0 && totalExpense == 0 ? (
              <Text style={styles.noTransaction}>Không có giao dịch</Text>
            ) : (
              Array.isArray(Category?.result?.result) &&
              Category?.result?.result
                .filter(item => (item.totalExpense ?? 0) !== 0 || (item.totalIncome ?? 0) !== 0) // Lọc danh mục có giao dịch
                ?.map((item, index) => (
                  <View key={index} style={styles.transactionItem}>
                    {/* Hiển thị danh mục */}
                    <Text style={styles.transactionCategory}>{item?.category || "Không xác định"}</Text>

                    {Array.isArray(item.transactions) && item.transactions.length > 0 ? (
                      item?.transactions?.map((transaction, tIndex) => (
                
                        <TouchableOpacity onLongPress={()=>handleDeleteItem(transaction._id)} key={`${index}-${tIndex}`} style={styles.transactionDetail}>
                          <Text style={styles.transactionDesc}>
                            {transaction?.description || "Không có mô tả"}
                          </Text>
                          <Text style={styles.transactionAmount}>
                            {transaction?.type === 1 ? "-" : "+"}
                            {(transaction?.amount ?? 0).toLocaleString()}đ
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noTransaction}>Không có giao dịch</Text>
                    )}
                  </View>
                ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#444",
    marginTop: 10,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  incomeText: { color: "#1E90FF", fontSize: 16, fontWeight: "bold" },
  incomeAmount: { color: "#1E90FF", fontSize: 18 },
  expenseText: { color: "#FF4500", fontSize: 16, fontWeight: "bold" },
  expenseAmount: { color: "#FF4500", fontSize: 18 },
  totalText: { color: "#27ae60", fontSize: 16, fontWeight: "bold" },
  totalAmount: { color: "#27ae60", fontSize: 18 },

  // style cho phần hiển thị giao dịch
  transactionContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    flex: 1
  },
  selectedDate: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  transactionCategory: { color: "#EE8E20", fontWeight: "bold", width: '20%', marginBottom: 10 },
  transactionDesc: { color: "#000", flex: 1, paddingLeft: 10 },
  transactionAmount: { color: "#FF4500", fontWeight: "bold" },
  noTransaction: {
    color: "#999", textAlign: "center", marginTop: 10

  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
    maxHeight: 300,
  },
  transactionDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9", // Màu nền nhẹ để phân biệt
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd", // Viền nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Hiệu ứng nổi trên Android

  },
  transactionDesc: {
    flex: 1,
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
    paddingRight: 10, // Khoảng cách với số tiền
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF4500", // Màu đỏ nổi bật cho số tiền
  },
})