import React, { useState } from "react";
import { TouchableOpacity, View, Text, ScrollView, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const Search = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState("month"); // "month" hoặc "year"
  const [tab, setTab] = useState("chiTieu"); // "chiTieu" hoặc "thuNhap"

  const transactions = {
    "2024-11": {
      chiTieu: [
        { category: "Ăn uống", amount: 500000 },
        { category: "Giáo dục", amount: 300000 },
        { category: "Đi lại", amount: 200000 },
      ],
      thuNhap: [
        { category: "Lương", amount: 1000000 },
        { category: "Thưởng", amount: 500000 },
      ],
    },
    "2024-12": {
      chiTieu: [
        { category: "Mua sắm", amount: 700000 },
        { category: "Giải trí", amount: 400000 },
      ],
      thuNhap: [
        { category: "Lương", amount: 1200000 },
      ],
    },
  };

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
        if (newDate) setSelectedDate(newDate);
      },
    });
  };

  const currentKey = formatDate(selectedDate);
  let data = [];

  if (viewType === "month") {
    data = transactions[currentKey]?.[tab] || [];
  } else {
    const year = selectedDate.getFullYear().toString();
    Object.keys(transactions).forEach((key) => {
      if (key.startsWith(year)) {
        data = [...data, ...transactions[key][tab]];
      }
    });
  }

  const chartData = data.map((item, index) => ({
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
        <TouchableOpacity onPress={() => setViewType("month")}>
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
        <TouchableOpacity onPress={() => setTab("chiTieu")}>
          <Text style={[styles.tab, tab === "chiTieu" && styles.activeTab]}>Chi Tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("thuNhap")}>
          <Text style={[styles.tab, tab === "thuNhap" && styles.activeTab]}>Thu Nhập</Text>
        </TouchableOpacity>
      </View>

      {data.length > 0 ? (
        <ScrollView>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
            <PieChart
              data={chartData}
              width={200} // Giảm chiều rộng để vừa với màn hình
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              paddingLeft="40"
              hasLegend={false} // Ẩn chú thích mặc định
            />
            {renderLegend()}
          </View>

          <View style={styles.listContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.transactionRow}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.description}>Chi tiết giao dịch</Text>
                <Text style={styles.amount}>{item.amount.toLocaleString()}đ</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>Không có giao dịch trong khoảng thời gian này.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  tab: { fontSize: 18, paddingVertical: 8, paddingHorizontal: 16, color: "gray" },
  activeTab: { fontWeight: "bold", color: "black", borderBottomWidth: 2, borderBottomColor: "black" },
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
