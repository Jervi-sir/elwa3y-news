import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const ShakeAnimation = ({ children, trigger, updateSetError }) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 7, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (trigger) {
      shake();
      setTimeout(() => {
        updateSetError(false);
      }, 500);
    }
  }, [trigger]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      {children}
    </Animated.View>
  );
};

export default ShakeAnimation;