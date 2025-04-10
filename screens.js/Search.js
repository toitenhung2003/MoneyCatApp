import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, ScrollView, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Search = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [Category, setCategory] = useState({ result: { result: [] } });
  const [token2, setToken] = useState()
  const [viewType, setViewType] = useState("month"); // "month" hoặc "year"
  const [tab, setTab] = useState(1); // "chiTieu" hoặc "thuNhap"
  const [trans, setTrans] = useState([])


  const getCategoryData = async (date) => {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);
      const token = userData.accessToken
      setToken(token)
      await console.log("lấy dữ liệu user thành công");
      console.log("token: ", token);

      const year = date.getFullYear();
      const month = date.getMonth(); // Tháng (0-11)

      // Ngày đầu tháng (UTC)
      const firstDay = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

      // Ngày cuối tháng (UTC)
      const lastDay = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

      const formatFirst = moment(firstDay).format('YYYY-MM-DD');
      const formatLast = moment(lastDay).format('YYYY-MM-DD');
      console.log("ngày đầu: ", formatFirst);
      console.log("ngày cuối: ", formatLast);



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
        setCategory(data)
        // console.log("thống kê: ", data);


      } catch (error) {
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
        console.log("error", error);

      }


    }


  };
  useEffect(() => {
    if (selectedDate) {
      // showDatePicker()
      // calculateTotals();
      getCategoryData(selectedDate)
      console.log("selectedDate: ", selectedDate);


    }
  }, [selectedDate,tab]);



  const formatDate = (date) => {
    return viewType === "month"
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      : `${date.getFullYear()}`;
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: viewType === "month" ? "date" : "spinner",
      onChange: (event, newDate) => {
        if (newDate) {
          setSelectedDate(newDate);
          getCategoryData(newDate) // Gọi hàm log ngay sau khi chọn ngày
        }
      },
    });
  };

  
  console.log("Category: ", Category);

  const mergedTransactions = (Category?.result?.result || [])
  .map(item =>
    (item.transactions || []).map(transaction => ({
      ...transaction,
      category: item.category
    }))
  )
  .flat();

  console.log("mergedTransactions", mergedTransactions);
  

  const chartData = mergedTransactions
  .filter(item => item.type === tab) // Lọc theo loại: thu nhập hoặc chi tiêu
  .map((item, index) => ({
    name: item.category,
    amount: item.amount,
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"][index % 4],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  const renderLegend = () => (
    <View style={{ marginLeft: 10, justifyContent: "center" }}>
      {chartData.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: 5 }} />
          <Text style={{ color: "gray" }}>{item.name}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{}} onPress={() => setViewType("month")}>
          <Text style={[styles.tab, viewType === "month" && styles.activeTab]}>Hàng Tháng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewType("year")}>
          <Text style={[styles.tab, viewType === "year" && styles.activeTab]}>Hàng Năm</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={showDatePicker}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab(1)}>
          <Text style={[styles.tab, tab === 1 && styles.activeTab]}>Chi Tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab(0)}>
          <Text style={[styles.tab, tab === 0 && styles.activeTab]}>Thu Nhập</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <PieChart
          data={chartData} // Nếu chartData cần thay đổi theo item, cần cập nhật lại
          width={200}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          paddingLeft="40"
          hasLegend={false}
        />
        {renderLegend()}
      </View>

      <ScrollView>
        {Category?.result?.result?.length > 0 ? (
          Category.result.result
            .filter(item => item.type === tab)
            .map((item, index) => (
              <View key={index}>
                {/* Biểu đồ PieChart */}
                {/* {setTrans(item)}

              {/* Danh sách giao dịch */}
                <View style={styles.listContainer}>
                  {item?.transactions.map((transaction, idx) => (
                    <View key={idx} style={styles.transactionRow}>
                      <Text style={styles.category}>{transaction?.description}</Text>
                      <Text style={styles.description}>Chi tiết giao dịch</Text>
                      <Text style={styles.amount}>{transaction?.amount.toLocaleString()}đ</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu</Text>
        )}

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  tab: { fontSize: 18, paddingVertical: 8, paddingHorizontal: 16, color: "gray" },
  activeTab: { fontWeight: "bold", color: "white", backgroundColor: '#EE8E20', borderRadius: 10 },
  dateText: { fontSize: 18, textAlign: "center", marginVertical: 10 },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  noDataText: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 20 },
  listContainer: {
    marginTop: 20,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  category: {
    color: "green",
    fontWeight: "bold",
    flex: 1,
  },
  description: {
    flex: 2,
    color: "#000",
  },
  amount: {
    color: "red",
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },

});

export default Search;
