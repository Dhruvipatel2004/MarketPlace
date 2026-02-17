import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveData = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }catch (error) {
        console.log("Error saving data", error)
    }
};

export const getData = async (key: string) => {
    try{
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }catch (error) {
        console.log("Error getting Data: ", error);
    }
};

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    }catch (error) {
        console.log("Error removing data: ", error)
    }
}