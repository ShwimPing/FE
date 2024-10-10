/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import Svg, {Path, G, Defs, ClipPath, Rect} from 'react-native-svg';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchScreen'>;

const SearchScreen: React.FC<Props> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('별점순');
  const [isFilterPressed, setIsFilterPressed] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const categoryMap: {[key: string]: string} = {
    전체: '',
    무더위쉼터: 'HOT',
    한파쉼터: 'COLD',
    도서관쉼터: 'LIBRARY',
    스마트쉼터: 'SMART',
    기후동행쉼터: 'TOGETHER',
  };

  const categoryMapToKorean: {[key: string]: string} = {
    TOGETHER: '기후동행쉼터',
    SMART: '스마트쉼터',
    HOT: '무더위쉼터',
    LIBRARY: '도서관쉼터',
    COLD: '한파쉼터',
  };

  const categoryColors: {[key: string]: string} = {
    //전체: '#F3F5F7',
    기후동행쉼터: '#E5F9EE',
    무더위쉼터: '#E0F8F7',
    도서관쉼터: '#E0F4FD',
    스마트쉼터: '#FDE6F4',
    한파쉼터: '#E8EAF6',
  };

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === '') {
      setSearchActive(false);
      return;
    }

    try {
      const category = selectedCategory === '전체' ? Object.values(categoryMap).filter(Boolean).join(',') : categoryMap[selectedCategory];

      const response = await axios.get('http://211.188.51.4/places/search', {
        params: {
          longitude: 127.0965824,
          latitude: 37.47153792,
          maxDistance: 100000,
          category,
          sortType: selectedFilter === '별점순' ? 'STAR_DESC' : 'DISTANCE_ASC',
          page: 0,
          keyword: searchQuery,
        },
      });

      console.log('API 응답 데이터:', response.data);

      setFilteredResults(response.data.results.placeList);
      setSearchActive(true);

      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prevSearches =>
          [searchQuery, ...prevSearches].slice(0, 5),
        );
      }
    } catch (error) {
      console.error('검색 결과 가져오기 오류:', error);
    }
  }, [searchQuery, selectedCategory, selectedFilter, recentSearches]);

  useEffect(() => {
    handleSearch();
  }, [selectedCategory, searchQuery, handleSearch]);

  const clearRecentSearch = (itemToRemove: string) => {
    setRecentSearches(prevSearches =>
      prevSearches.filter(item => item !== itemToRemove),
    );
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    toggleFilterModal();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Svg width="40" height="44" viewBox="0 0 40 44" fill="none">
            <Path
              d="M23.2727 29.2L16.7273 22L23.2727 14.8"
              stroke="#1A1A1B"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력해주세요."
            placeholderTextColor="#8E9398"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {searchQuery.length > 0 && (
        <View>
          <View style={styles.categoryWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}>
              {Object.keys(categoryMap).map(category => (
                <TouchableOpacity
                  key={category}
                  onPress={() => handleCategorySelect(category)}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category &&
                      styles.categoryItemSelected,
                  ]}>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextSelected,
                    ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterWrapper}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={toggleFilterModal}>
              <Text style={styles.filterButtonText}>{selectedFilter}</Text>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={styles.filterIcon}>
                <Path
                  d="M6 9L12 15L18 9"
                  stroke="#505458"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <Modal
            visible={filterModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleFilterModal}>
            <TouchableWithoutFeedback onPress={toggleFilterModal}>
              <View style={styles.modalOverlay}>
                <View style={styles.filterModal}>
                  <Text style={styles.filterModalTitle}>필터</Text>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      isFilterPressed === '별점순' &&
                        styles.selectedFilterOption,
                    ]}
                    onPressIn={() => setIsFilterPressed('별점순')}
                    onPressOut={() => {
                      setIsFilterPressed(null);
                      handleFilterSelect('별점순');
                    }}>
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedFilter === '별점순' &&
                          styles.selectedFilterOptionText,
                      ]}>
                      별점순
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      isFilterPressed === '거리순' &&
                        styles.selectedFilterOption,
                    ]}
                    onPressIn={() => setIsFilterPressed('거리순')}
                    onPressOut={() => {
                      setIsFilterPressed(null);
                      handleFilterSelect('거리순');
                    }}>
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedFilter === '거리순' &&
                          styles.selectedFilterOptionText,
                      ]}>
                      거리순
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}

      {!searchActive ? (
        <View style={styles.recentSearchContainer}>
          <View style={styles.recentSearchHeaderContainer}>
            <Text style={styles.recentSearchHeader}>최근 검색어</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearAllButton}>검색 기록 전체 삭제</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentSearches}
            renderItem={({item}) => (
              <View style={styles.recentSearchItem}>
                <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <Path
                    d="M8.00004 4.49992V8.49992L10.6667 9.83325M14.6667 8.49992C14.6667 12.1818 11.6819 15.1666 8.00004 15.1666C4.31814 15.1666 1.33337 12.1818 1.33337 8.49992C1.33337 4.81802 4.31814 1.83325 8.00004 1.83325C11.6819 1.83325 14.6667 4.81802 14.6667 8.49992Z"
                    stroke="#D2D3D3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>

                <View style={styles.searchItemContent}>
                  <Text style={styles.searchText}>{item}</Text>

                  <TouchableOpacity onPress={() => clearRecentSearch(item)}>
                    <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                      <G clipPath="url(#clip0_323_1064)">
                        <Path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.75735 4.07597C3.95261 3.8807 4.26919 3.8807 4.46445 4.07597L12.2426 11.8541C12.4379 12.0494 12.4379 12.366 12.2426 12.5612C12.0474 12.7565 11.7308 12.7565 11.5355 12.5612L3.75735 4.78307C3.56209 4.58781 3.56209 4.27123 3.75735 4.07597Z"
                          fill="#D2D3D3"
                        />
                        <Path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.2427 4.07597C12.4379 4.27123 12.4379 4.58781 12.2427 4.78307L4.46448 12.5612C4.26922 12.7565 3.95263 12.7565 3.75737 12.5612C3.56211 12.366 3.56211 12.0494 3.75737 11.8541L11.5355 4.07597C11.7308 3.8807 12.0474 3.8807 12.2427 4.07597Z"
                          fill="#D2D3D3"
                        />
                      </G>
                      <Defs>
                        <ClipPath id="clip0_323_1064">
                          <Rect
                            width="12"
                            height="12"
                            fill="white"
                            transform="translate(8 -0.166748) rotate(45)"
                          />
                        </ClipPath>
                      </Defs>
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchDetail', {placeId: item.placeId})
              }>
              <View style={styles.resultItem}>
                <View
                  style={[
                    styles.categoryBox,
                    {
                      backgroundColor:
                        categoryColors[categoryMapToKorean[item.category]] ||
                        '#F3F5F7',
                    },
                  ]}>
                  <Text style={styles.categoryBoxText}>
                    {categoryMapToKorean[item.category] || item.category}
                  </Text>
                </View>

                <Text style={styles.resultName}>{item.name}</Text>

                <View style={styles.ratingContainer}>
                  <Svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <Path
                      d="M7.00003 10.0496L10.0448 11.8912C10.6024 12.2287 11.2847 11.7298 11.138 11.0988L10.331 7.63582L13.0236 5.3027C13.5151 4.87717 13.251 4.07011 12.6054 4.01875L9.06168 3.71794L7.67502 0.445713C7.42556 -0.148571 6.57449 -0.148571 6.32504 0.445713L4.93837 3.71061L1.39468 4.01142C0.749039 4.06278 0.484913 4.86983 0.976481 5.29536L3.6691 7.62848L2.86205 11.0915C2.71531 11.7224 3.39764 12.2213 3.95524 11.8838L7.00003 10.0496Z"
                      fill="#FFD643"
                    />
                  </Svg>
                  <Text style={styles.ratingText}>
                    {item.rating?.toFixed(1) || 'N/A'}
                  </Text>
                  <Text style={styles.reviewCount}>
                    ({item.reviewCount || 0})
                  </Text>
                </View>

                <Text style={styles.resultDetails}>
                  {`${item.distance || 'N/A'}m · ${
                    item.address || '주소 없음'
                  } | ${item.openTime}~${item.closeTime}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.placeId.toString()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  searchBox: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#222',
  },
  categoryWrapper: {
    height: 40,
    marginBottom: 8,
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  categoryItemSelected: {
    borderBottomColor: '#222',
  },
  categoryBox: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#F3F5F7',
  },
  categoryBoxText: {
    color: '#1A1A1B',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 18,
  },
  categoryText: {
    color: '#8E9398',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 21,
  },
  categoryTextSelected: {
    color: '#222',
    fontFamily: 'Pretendard-Bold',
  },
  filterWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#505458',
    fontFamily: 'Pretendard-Regular',
  },
  filterIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  filterModal: {
    width: '100%',
    height: 189,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  filterModalTitle: {
    color: '#1A1A1B',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  selectedFilterOption: {
    backgroundColor: '#F1F1F1',
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#1A1A1B',
  },
  selectedFilterOptionText: {
    fontFamily: 'Pretendard-Bold',
    color: '#1A1A1B',
  },
  recentSearchContainer: {
    flex: 1,
  },
  recentSearchHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentSearchHeader: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    lineHeight: 21,
  },
  clearAllButton: {
    color: '#8E9398',
    fontSize: 12,
    fontWeight: '400',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  searchText: {
    flex: 1,
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  resultName: {
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: '#1A1A1B',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
  },
  reviewCount: {
    marginLeft: 4,
    color: '#8E9398',
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
  },
  resultDetails: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Pretendard-Bold',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default SearchScreen;
