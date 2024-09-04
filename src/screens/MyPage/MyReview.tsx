import React from 'react';
import {Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'MyReview'>;

const MyReview: React.FC<Props> = () => {
  return <Text>여긴 내 리뷰</Text>;
};

// const styles = StyleSheet.create({

// });

export default MyReview;
