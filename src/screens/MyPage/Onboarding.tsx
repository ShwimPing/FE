import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native'; // 수정
import { RootStackParamList } from '../../App';

const {width} = Dimensions.get('window');

type Slide = {
  id: string;
  image: any;
  title: string;
  description: string;
};

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide> | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // 타입 지정

  const slides: Slide[] = [
    {
      id: '1',
      image: require('../../../assets/images/onboard1.png'),
      title: '쉼터 한 눈에 파악하기',
      description: '홈화면에서 다양한 쉼터를\n종류별로 쉽게 확인해요',
    },
    {
      id: '2',
      image: require('../../../assets/images/onboard2.png'),
      title: '쉼터 이야기 남기기',
      description: '쉼터 방문 후기를 작성하고\n다른 사용자의 리뷰도 확인해요',
    },
    {
      id: '3',
      image: require('../../../assets/images/onboard3.png'),
      title: '음성 인식으로 쉼터 찾기',
      description: '음성 인식 기능으로\n원하는 쉼터를 손쉽게 찾아보세요',
    },
  ];

  const handleNext = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    }
  };

  const handleStart = () => {
    // "쉼핑 시작하기"를 눌렀을 때 Splash 화면으로 이동
    navigation.navigate('Splash');
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = Math.ceil(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(scrollPosition);
  };

  const renderItem = ({item}: {item: Slide}) => (
    <View style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ref={flatListRef}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={
              currentIndex === index ? styles.activeDot : styles.inactiveDot
            }
          />
        ))}
      </View>
      {currentIndex === slides.length - 1 ? (
        <TouchableOpacity style={styles.imageButton} onPress={handleStart}>
          <Image
            source={require('../../../assets/images/onboardbtn.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>쉼핑 시작하기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#1A1A1B',
    marginTop: 77,
  },
  description: {
    fontSize: 14,
    color: '#7F7F86)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 26,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  inactiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    width: '80%',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonImage: {
    width: 343,
    height: 50,
    resizeMode: 'contain',
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
  },
});

export default Onboarding;
