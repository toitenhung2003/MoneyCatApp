import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Dialog, Portal, Button, Provider, Menu } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Save = () => {
    const [wallets, setWallets] = useState([]);
    const [visible, setVisible] = useState(false);
    const [walletName, setWalletName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [editingWalletId, setEditingWalletId] = useState(null);
    const { darkMode } = useContext(ThemeContext);
    const [Category, setCategory] = useState({ result: { result: [] } });
    const [menuVisibleId, setMenuVisibleId] = useState(null);


    const navigation = useNavigation();
    useEffect(() => {

        getCategory()
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            getCategory(); // mỗi lần màn hình focus lại sẽ load lại dữ liệu
        }, [])
    );

    const getCategory = async () => {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(storedData);
            const token = userData.accessToken;

            try {
                const response = await fetch('https://test-spending-management.glitch.me/savingGoals/', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                });

                const data = await response.json();
                if (data.result.result.length === 0) {
                    console.log("Không có ví nào");
                    setCategory(Category)
                }
                else {
                    setCategory(data);
                }

                console.log("tất cả ví: ", data);

            } catch (error) {
                Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
                console.log("error", error);
            }
        }
    };

    const showDialog = () => setVisible(true);
    const hideDialog = () => {
        setVisible(false);
        setWalletName('');
        setTargetAmount('');
        setEditingWalletId(null);
    };

    const handleAddWallet = async () => {
        if (!walletName || !targetAmount) return;


        if (editingWalletId) {
            console.log("sửa: ", editingWalletId, walletName, parseFloat(targetAmount));
            const storedData = await AsyncStorage.getItem('userData');
            if (storedData) {

                const userData = JSON.parse(storedData);
                const token = userData.accessToken;

                try {

                    const response = await fetch('https://test-spending-management.glitch.me/savingGoals/', {
                        method: 'PATCH',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "savingGoalId": editingWalletId,
                            "name": walletName,
                            "targetAmount": parseFloat(targetAmount),
                            "description": "ko co",
                            "status": 1
                        }),
                    });

                    const data = await response.json();
                    if (data.result.errorCode === 1) {

                        Alert.alert(" Sửa không thành công")
                    } else {

                        getCategory()
                    }
                } catch (error) {
                    Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
                    console.log("error", error);
                }
            }




        } else {
            const storedData = await AsyncStorage.getItem('userData');

            if (storedData) {
                const userData = JSON.parse(storedData);
                const token = userData.accessToken;

                try {

                    const response = await fetch('https://test-spending-management.glitch.me/savingGoals/', {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "name": walletName,
                            "targetAmount": parseFloat(targetAmount),
                            "endDate": "2025-12-10",
                            "description": "ko co"
                        }),
                    });

                    const data = await response.json();
                    if (data.result.errorCode === 1) {

                        Alert.alert(" Thêm không thành công")
                    } else {

                        getCategory()
                    }
                } catch (error) {
                    Alert.alert("Lỗi kết nối", "Không thể kết nối đến server!");
                    console.log("error", error);
                }
            }




        }

        hideDialog();
    };

    const confirmDeleteWallet = (id) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa ví này không?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        const updatedWallets = wallets.filter(wallet => wallet.id !== id);
                        setWallets(updatedWallets);
                    },
                },
            ]
        );
    };

    const handleEditWallet = (wallet) => {
        setEditingWalletId(wallet._id);
        setWalletName(wallet.name);
        setTargetAmount(wallet.targetAmount.toString());
        showDialog();
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: darkMode ? '#333' : 'white' }]}>
            {/* Phần bấm vào để xem chi tiết ví */}
            <TouchableOpacity
                style={styles.cardLeft}
                onPress={() => navigation.navigate('ChiTietViScreen', {
                    wallet: item // Hàm để load lại dữ liệu
                })}
                activeOpacity={0.7}
            >
                <View style={styles.iconCircle}>
                    <FontAwesome name="bank" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.walletName, { color: darkMode ? 'white' : 'black' }]}>{item.name}</Text>
                    <Text style={styles.walletAmount}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: darkMode ? 'white' : 'black' }}>
                            {item.currentAmount.toLocaleString('vi-VN')}
                        </Text> <Text style={{ color: darkMode ? 'white' : 'black' }}>/ {item.targetAmount.toLocaleString('vi-VN')}đ</Text>
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Nút sửa và xóa */}
            <View style={styles.cardRight}>
                <Menu
                    visible={menuVisibleId === item._id}
                    onDismiss={() => setMenuVisibleId(null)}
                    anchor={
                        <TouchableOpacity onPress={() => setMenuVisibleId(item._id)} style={styles.iconButton}>
                            <MaterialCommunityIcons name="dots-vertical" size={22} color="#2980b9" />
                        </TouchableOpacity>
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setMenuVisibleId(null);
                            handleEditWallet(item);
                        }}
                        title="Sửa"
                        leadingIcon="pencil"
                    />
                    {/* Nếu muốn thêm Xóa, bạn có thể bỏ comment bên dưới */}
                    {/* 
        <Menu.Item
            onPress={() => {
                setMenuVisibleId(null);
                confirmDeleteWallet(item._id);
            }}
            title="Xóa"
            leadingIcon="delete"
        />
        */}
                </Menu>
            </View>

        </View>
    );



    return (
        <Provider>
            <View style={[styles.container, darkMode && styles.darkContainer]}>
                <Text style={[styles.title, { color: darkMode ? 'white' : 'black' }]}>Ví tiết kiệm</Text>

                <FlatList
                    data={Category?.result?.result}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />

                <TouchableOpacity style={styles.floatingButton} onPress={showDialog}>
                    <FontAwesome name="plus" size={24} color="#fff" />
                </TouchableOpacity>

                <Portal >
                    <Dialog visible={visible} onDismiss={hideDialog} style={[styles.dialogBox, { backgroundColor: darkMode ? "#222" : 'white' }]}>
                        <Dialog.Title style={{fontWeight:'bold' ,textAlign: 'center', color: darkMode ? 'white' : 'black' }}>
                            {editingWalletId ? 'Sửa ví' : 'Thêm ví tiết kiệm'}
                        </Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                style={[styles.input, { backgroundColor: darkMode ? '#333' : 'white' }, { color: darkMode ? 'white' : 'black' }]}
                                placeholder="Nhập tên ví"
                                value={walletName}
                                onChangeText={setWalletName}
                                placeholderTextColor={darkMode ? 'white' : 'black'}
                            />
                            <TextInput
                                style={[styles.input, { backgroundColor: darkMode ? '#333' : 'white' }, { color: darkMode ? 'white' : 'black' }]}
                                placeholder="Nhập số tiền mục tiêu"
                                keyboardType="numeric"
                                value={targetAmount}
                                onChangeText={setTargetAmount}
                                placeholderTextColor={darkMode ? 'white' : 'black'}

                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Hủy</Button>
                            <Button onPress={handleAddWallet}>
                                {editingWalletId ? 'Lưu' : 'Tạo quỹ'}
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 5,

    },
    walletContainer: {
        marginBottom: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    walletHeader: {
        height: 50,
        backgroundColor: '#ffaf40',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    walletContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDF7F7',
        padding: 12,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    walletName: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    walletAmount: {
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 8,
        backgroundColor: '#f5f5f5',
    },
    actionButton: {
        marginLeft: 12,
    },
    editText: {
        color: '#2980b9',
    },
    deleteText: {
        color: '#e74c3c',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#F28C28',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    dialogBox: {
        borderRadius: 8,
        backgroundColor: 'white'
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 6,
        borderLeftColor: '#F28C28',
    },

    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F28C28',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    walletName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },

    walletAmount: {
        color: '#555',
        fontSize: 14,
    },
    darkContainer: {
        backgroundColor: '#222',
    },

});

export default Save;
