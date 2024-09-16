import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent';

const Home = () => {
  const [showVoiceRecognition, setShowVoiceRecognition] = useState(false);


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <G clipPath="url(#clip0_305_1339)">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.56188 1.7499C5.61461 1.7426 4.68649 2.01674 3.89521 2.53756C3.10392 3.05837 2.4851 3.80241 2.11719 4.67536C1.74928 5.5483 1.64885 6.51082 1.82864 7.44091C2.00843 8.371 2.46033 9.22675 3.12706 9.8997C3.79379 10.5726 4.64533 11.0325 5.5737 11.2209C6.50208 11.4093 7.4655 11.3178 8.34181 10.958C9.21813 10.5982 9.96788 9.98628 10.496 9.19985C11.0241 8.41343 11.3069 7.4879 11.3084 6.5406L11.9334 6.54158L11.3084 6.53964C11.3123 5.27577 10.815 4.0619 9.92544 3.16407C9.0359 2.26624 7.82669 1.7577 6.56284 1.7499L6.56188 1.7499ZM12.5584 6.54304C12.5564 7.73773 12.1998 8.90494 11.5337 9.89674C10.8676 10.8887 9.9219 11.6605 8.81658 12.1143C7.71126 12.5681 6.49609 12.6835 5.3251 12.4459C4.15411 12.2083 3.08005 11.6283 2.23909 10.7795C1.39812 9.93067 0.828127 8.85128 0.601357 7.67814C0.374588 6.505 0.50126 5.29095 0.965314 4.18989C1.42937 3.08882 2.20991 2.15035 3.20797 1.49343C4.20604 0.836507 5.37669 0.490731 6.57151 0.499935L6.5667 1.12492L6.57055 0.499928C6.57087 0.49993 6.57119 0.499933 6.57151 0.499935C8.16586 0.510023 9.69123 1.15166 10.8134 2.2843C11.9357 3.41704 12.5632 4.94849 12.5584 6.54304Z"
                fill="#8E9398"
              />
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2669 10.2576C10.5112 10.0137 10.9069 10.0141 11.1508 10.2585L15.3174 14.4335C15.5613 14.6778 15.5609 15.0735 15.3165 15.3173C15.0722 15.5612 14.6765 15.5608 14.4327 15.3165L10.266 11.1415C10.0222 10.8971 10.0226 10.5014 10.2669 10.2576Z"
                fill="#8E9398"
              />
            </G>
            <Defs>
              <ClipPath id="clip0_305_1339">
                <Rect width="15" height="15" fill="white" transform="translate(0.5 0.5)" />
              </ClipPath>
            </Defs>
          </Svg>
          <TextInput style={styles.input} placeholder="검색어를 입력해주세요." placeholderTextColor="#8E9398" />
          <TouchableOpacity onPress={() => setShowVoiceRecognition(!showVoiceRecognition)}>
            <Svg width="20" height="21" viewBox="0 0 20 21" fill="none">
              <Path
                d="M15.8333 8.83342V10.5001C15.8333 13.7217 13.2216 16.3334 9.99996 16.3334M4.16663 8.83342V10.5001C4.16663 13.7217 6.7783 16.3334 9.99996 16.3334M9.99996 16.3334V18.8334M6.66663 18.8334H13.3333M9.99996 13.0001C8.61925 13.0001 7.49996 11.8808 7.49996 10.5001V4.66675C7.49996 3.28604 8.61925 2.16675 9.99996 2.16675C11.3807 2.16675 12.5 3.28604 12.5 4.66675V10.5001C12.5 11.8808 11.3807 13.0001 9.99996 13.0001Z"
                stroke="#1A1A1B"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={showVoiceRecognition}
        animationType="slide"
        onRequestClose={() => setShowVoiceRecognition(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowVoiceRecognition(false)}>
          <View style={styles.overlay}>
            <View style={styles.voiceRecognitionContainer}>
              <Text style={styles.voiceRecognitionText}>음성 인식으로 원하는 쉼터를 찾아보세요</Text>
              <View style={styles.voiceRecognitionInner}>
                <Text style={styles.voiceRecognitionPrompt}>"제일 가까운 쉼터 찾아줘"</Text>
              </View>
              <TouchableOpacity style={styles.microphoneButton}>
                <Svg width="27" height="37" viewBox="0 0 27 37" fill="none">
                  <Path
                    d="M25.1667 15.2918V18.6252C25.1667 25.0685 19.9434 30.2918 13.5 30.2918M1.83337 15.2918V18.6252C1.83337 25.0685 7.05672 30.2918 13.5 30.2918M13.5 30.2918V35.2918M6.83337 35.2918H20.1667M13.5 23.6252C10.7386 23.6252 8.50004 21.3866 8.50004 18.6252V6.9585C8.50004 4.19707 10.7386 1.9585 13.5 1.9585C16.2615 1.9585 18.5 4.19707 18.5 6.9585V18.6252C18.5 21.3866 16.2615 23.6252 13.5 23.6252Z"
                    stroke="#1A1A1B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <MapComponent />

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    display: 'flex',
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 9.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#222',
    padding: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    justifyContent: 'flex-end',
  },
  voiceRecognitionContainer: {
    height: 300,
    paddingVertical: 51,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRecognitionText: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 27,
    marginBottom: 24,
  },
  voiceRecognitionInner: {
    display: 'flex',
    width: 200,
    height: 40,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    marginBottom: 24,
  },
  voiceRecognitionPrompt: {
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 24,
    color: '#505458',
  },
  microphoneButton: {
    display: 'flex',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#F1F1F1',
  },
});

export default Home;
