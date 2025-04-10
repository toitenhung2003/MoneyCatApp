import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const QuanLyNganSach = () => {
    const [budget, setBudget] = useState(10000000); // ngân sách tổng
    const [spent, setSpent] = useState(5000000); // số tiền đã chi

    const navigation = useNavigation();
    const progress = Math.min(spent / budget, 1);

    useEffect(() => {
        const ratio = spent / budget;
        if (ratio >= 0.9) {
            Alert.alert(
                "Cảnh báo",
                "Bạn đã chi tiêu vượt quá 90% ngân sách!",
                [{ text: "OK", onPress: () => {} }],
                { cancelable: true }
            );
        }
    }, [spent]);
    
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Quản lý ngân sách</Text>
            <Text style={styles.subtitle}>
                Bạn có thể đặt giới hạn chi tiêu để quản lý dòng tiền 1 cách hiệu quả
            </Text>

            <Text style={styles.label}>Đặt hạn mức chi tiêu theo tháng</Text>
            <TextInput
                placeholder="Nhập số tiền"
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Số tiền đã chi tiêu</Text>
            <View style={{ marginTop: 10 }}>
                <View style={styles.progressBackground}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={[styles.optionSubtitle,]}>
                    Đã chi: {spent.toLocaleString()} / {budget.toLocaleString()} VND
                </Text>
                <TouchableOpacity onPress={() => setSpent(prev => prev + 1000000)} style={{ marginTop: 10 }}>
                    <Text style={{ color: 'blue' }}>+ Thêm 1 triệu chi tiêu</Text>
                </TouchableOpacity>

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
    },
    progressContainer: {
        marginTop: 20,
    },
    backButton: {
        marginBottom: '5%',
    },
    progressBackground: {
        height: 16,
        backgroundColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 6,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
    },

});
