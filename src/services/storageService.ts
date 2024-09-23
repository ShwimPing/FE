import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeFcmToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('fcmToken', token);
    // console.log('FCM 토큰 저장 성공');
  } catch (error) {
    console.error('FCM 토큰 저장 실패:', error);
  }
};

export const getStoredFcmToken = async () => {
  try {
    const token = await AsyncStorage.getItem('fcmToken');
    if (token !== null) {
      // console.log('저장된 FCM 토큰:', token);
      return token;
    } else {
      console.log('FCM 토큰이 저장 실패');
      return null;
    }
  } catch (error) {
    console.error('FCM 토큰 가져오기 실패:', error);
    return null;
  }
};
