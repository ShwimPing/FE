import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Footer from '../components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'ContentsList'>;

type ContentItem = {
  cardNewsId: string;
  title: string;
  cardImageUrl: string;
};

const ContentsList: React.FC<Props> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('HOT');
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://211.188.51.4/card-news?cardNewsCategory=${category}`);
      const result = await response.json();
      if (result.isSuccess && result.results.cardNewsList) {
        setData(result.results.cardNewsList);
      } else {
        console.error('Failed to load data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  const renderItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ContentDetail', { title: item.title })}
    >
      <Image source={{ uri: item.cardImageUrl }} style={styles.itemImage} />
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.menuTabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'HOT' && styles.activeTab]}
          onPress={() => setSelectedTab('HOT')}
        >
          <Text style={[styles.tabText, selectedTab === 'HOT' && styles.activeTabText]}>폭염</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'COLD' && styles.activeTab]}
          onPress={() => setSelectedTab('COLD')}
        >
          <Text style={[styles.tabText, selectedTab === 'COLD' && styles.activeTabText]}>한파</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.cardNewsId.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#8E9398',
  },
});

export default ContentsList;
