import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Footer from '../components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'ContentsList'>;

type ContentItem = {
  id: string;
  title: string;
  image: any;
};

const ContentsList: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('폭염');

  const data: ContentItem[] = [
    { id: '1', title: '폭염에 알아두면 좋은 무더위쉼터에 관한 모든 것', image: require('../../assets/images/heatwave1.png') },
    { id: '2', title: '폭염 3대 취약분야 행동요령', image: require('../../assets/images/heatwave1.png') },
    { id: '3', title: '폭염 대비 이렇게 행동하세요!', image: require('../../assets/images/heatwave1.png') },
    { id: '4', title: '폭염 시 행동요령', image: require('../../assets/images/heatwave1.png') },
  ];

  const renderItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ContentDetail', { title: item.title })}
    >
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.menuTabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === '폭염' && styles.activeTab]}
          onPress={() => setSelectedTab('폭염')}
        >
          <Text style={[styles.tabText, selectedTab === '폭염' && styles.activeTabText]}>폭염</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === '한파' && styles.activeTab]}
          onPress={() => setSelectedTab('한파')}
        >
          <Text style={[styles.tabText, selectedTab === '한파' && styles.activeTabText]}>한파</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  tab: {
    width: 187.5,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    color: '#8E9398',
  },
  activeTabText: {
    color: '#000',
  },
  listContainer: {
    paddingTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 9,
    marginBottom: 10,
  },
  itemImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  itemText: {
    color: '#000',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    lineHeight: 21,
  },
});

export default ContentsList;
