import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars';

const Chat = () => {
  const [selectedDate, setSelectedDate] = useState(null);

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
    
      
    } );
 

  //  Hàm tính tổng thu nhập, chi tiêu, tổng số dư
  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    Object.values(transactions).forEach((items) => {
      items.forEach((item) => {
        if (item.amount > 0) totalIncome += item.amount;
        else totalExpense += Math.abs(item.amount);
      });
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  };

  const { totalIncome, totalExpense, balance } = calculateTotals();

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
            {transactions[selectedDate] ? (
              transactions[selectedDate].map((item, index) => (
                <View key={index} style={styles.transactionItem}>
                  <Text style={styles.transactionCategory}>{item.category}</Text>
                  <Text style={styles.transactionDesc}>{item.description}</Text>
                  <Text style={styles.transactionAmount}>{item.amount.toLocaleString()}đ</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noTransaction}>Không có giao dịch</Text>
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
    marginTop:10
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
  totalText: { color: "#00BFFF", fontSize: 16, fontWeight: "bold" },
  totalAmount: { color: "#00BFFF", fontSize: 18 },

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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  transactionCategory: { color: "#4CAF50", fontWeight: "bold", width:'20%' },
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
})