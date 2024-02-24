import { View, Text, TouchableOpacity, Modal, StyleSheet, } from 'react-native';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { useColors } from '@context/ThemeContext';


export const SuccessLoader = ({ isDisplayed = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const animation = useRef(null);
  const { Colors } = useColors();

  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
    setTimeout(() => {
      animation.current?.play();
    }, 400);

  }, []);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 99,
      width: '100%',
      height: '100%'
    },
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040',  // Semi-transparent
    },
    activityIndicatorWrapper: {
      backgroundColor: Colors.backgroundLight,
      height: 100,
      width: 100,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    blurView: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });

  if (isDisplayed) {
    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={true}
          onRequestClose={() => {
            setIsLoading(false);
          }}>
          <View style={styles.modalBackground}>
            <BlurView style={styles.blurView} intensity={7} />
            <View style={styles.activityIndicatorWrapper}>
              <LottieView
                ref={animation}
                source={require('@assets/animated/animation_success.json')}
                autoPlay
                loop
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  return null;
}

