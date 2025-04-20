import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from 'react';
import { Alert, TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { ThemeContext } from '../contexts/ThemeContext';

const QuanLyNganSach = () => {
    const [budget, setBudget] = useState(0);
    const [inputBudget, setInputBudget] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [spent, setSpent] = useState(0);
    const [saveBudget, setSaveBudget] = useState(0);
    const [Category, setCategory] = useState({ result: { result: [] } });

    const navigation = useNavigation();
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        if (budget === 0) return;
    }, [spent, saveBudget]);

    useEffect(() => {
        getNumber();
        getCategory();
    }, []);

    const getNumber = async () => {
        try {
            const storedData = await AsyncStorage.getItem('userData');
            if (!storedData) return;

            const userData = JSON.parse(storedData);
            const userId = userData.user._id;
            const value = await AsyncStorage.getItem(`@my_number_${userId}`);
            const bo = await AsyncStorage.getItem('@my_flag');

            if (value !== null) {
                setSaveBudget(parseFloat(value));
                setInputBudget(parseFloat(value));
                setIsEditing(JSON.parse(bo));
                return parseFloat(value);
            }
        } catch (e) {
            console.error('Lỗi khi đọc số:', e);
        }
    };

    const handleBudgetChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const number = parseInt(numericText || '0', 10);
        setInputBudget(numericText.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        setBudget(number);
    };

    const getCategory = async () => {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            const token = userData.accessToken;
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const formatFirst = moment(firstDay).format('YYYY-MM-DD');
            const formatLast = moment(lastDay).format('YYYY-MM-DD');

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

                const data = await response.json();
                if (data.result.errorCode === 1) {
                    setCategory(Category);
                } else {
                    setCategory(data);
                }
            } catch (error) {
                Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
                console.log("error", error);
            }
        }
    };

    const handleEditBudget = async () => {
        try {
            await AsyncStorage.setItem('@my_flag', JSON.stringify(true));
        } catch (e) {
            console.error('Lỗi khi lưu số:', e);
        }
        setInputBudget(saveBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        setBudget(saveBudget);
        setIsEditing(true);
    };

    const handlBack = () => {
        if (isEditing == true) {
            Alert.alert("Bạn chưa chỉnh xong hạn mức chi tiêu");
            return;
        }
        navigation.goBack();
    };

    const totalIncome = (Category?.result?.result || [])
        ? Category.result.result.reduce((total, category) => {
            const incomeInCategory = category.transactions
                ?.filter(transaction => transaction.type === 1)
                ?.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0) || 0;
            return total + incomeInCategory;
        }, 0)
        : 0;

    const safeTotalIncome = isNaN(totalIncome) ? 0 : totalIncome;
    const safeSaveBudget = isNaN(saveBudget) ? 0 : saveBudget;
    const progress = safeSaveBudget > 0 ? (safeTotalIncome * 100) / safeSaveBudget : 0;

    const handleFinishEditing = async () => {
        if (isNaN(budget)) {
            Alert.alert("BẠN QUÊN CHƯA ĐẶT NGÂN SÁCH KÌA !!!!");
            return;
        } else if (budget === 0) {
            Alert.alert("BẠN THẬT SỰ KHÔNG MUỐN ĐẶT CHỈ TIÊU SAO !!!!");
        } else if (totalIncome > budget) {
            Alert.alert("BẠN KHÔNG THỂ ĐẶT CHỈ TIÊU THẤP HƠN SỐ ĐÃ CHI !!!!");
            return;
        }

        try {
            const storedData = await AsyncStorage.getItem('userData');
            if (!storedData) return;

            const userData = JSON.parse(storedData);
            const userId = userData.user._id;

            await AsyncStorage.setItem(`@my_number_${userId}`, budget.toString());
            await AsyncStorage.setItem('@my_flag', JSON.stringify(false));
        } catch (e) {
            console.error('Lỗi khi lưu số:', e);
        }

        setIsEditing(false);
        getNumber();
    };

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <TouchableOpacity style={styles.backButton} onPress={handlBack}>
                <Icon name="chevron-left" size={22} color={darkMode ? '#fff' : '#000'} />
            </TouchableOpacity>

            <Text style={[styles.title, darkMode && styles.darkText]}>Quản lý ngân sách</Text>
            <Text style={[styles.subtitle, darkMode && styles.darkSubtitle]}>
                Bạn có thể đặt giới hạn chi tiêu để quản lý dòng tiền 1 cách hiệu quả
            </Text>

            <Text style={[styles.label, darkMode && styles.darkText]}>Đặt hạn mức chi tiêu theo tháng</Text>

            {isEditing ? (
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Nhập số tiền"
                        placeholderTextColor={darkMode ? '#aaa' : '#666'}
                        style={[
                            styles.input,
                            { flex: 1 },
                            darkMode && styles.darkInput
                        ]}
                        keyboardType="numeric"
                        value={inputBudget}
                        onChangeText={handleBudgetChange}
                    />
                    <TouchableOpacity style={styles.doneButton} onPress={handleFinishEditing}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.inputRow}>
                    <Text style={[styles.fixedBudgetText, darkMode && styles.darkFixedText]}>
                        {saveBudget.toLocaleString('vi-VN')} VND
                    </Text>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditBudget}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sửa</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={[styles.label, darkMode && styles.darkText]}>Số tiền đã chi tiêu</Text>
            <View style={{ marginTop: 10 }}>
                <View style={[styles.progressBackground, darkMode && styles.darkProgressBackground]}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>

                <Text style={[styles.optionSubtitle, darkMode && styles.darkSubtitle]}>
                    Đã chi: {totalIncome.toLocaleString()} / {saveBudget.toLocaleString()} VND
                </Text>
            </View>
        </View>
    );
};

export default QuanLyNganSach;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a0a0a',
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
    },
    darkText: {
        color: '#fff',
    },
    darkSubtitle: {
        color: '#cccccc',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 20,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f1f3ff',
        padding: 12,
        borderRadius: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    darkInput: {
        backgroundColor: '#1e1e1e',
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    doneButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    editButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    fixedBudgetText: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        color: '#000',
    },
    darkFixedText: {
        color: '#fff',
    },
    progressBackground: {
        height: 16,
        backgroundColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 6,
    },
    darkProgressBackground: {
        backgroundColor: '#333',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    optionSubtitle: {
        marginTop: 6,
        fontSize: 15,
        color: '#333',
    },
    backButton: {
        marginBottom: '5%',
    },
});
