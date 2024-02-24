import { View, Animated } from 'react-native'

export const GeneralSkeleton = ({ backgroundColor='rgba(51,58,90,0.2)' }) => {

  const skeletonWidth = new Animated.Value(0);
  const skeletonOpacity = new Animated.Value(1); // New animated value for opacity
  Animated.loop(
    Animated.parallel([
      Animated.timing(skeletonWidth, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.sequence([  // New sequence for opacity animation
        Animated.timing(skeletonOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(skeletonOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(skeletonOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ])
  ).start();

  const loadingColor = backgroundColor;
  const loadingColorDarker = '#121212';

  const fullWidthSkeletonAniamtion = skeletonWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const opacitySkeletonAnimation = skeletonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  }); // New interpolated value for opacity

  const ViewAnimation = {
    width: fullWidthSkeletonAniamtion,
    height: '100%',
    backgroundColor: loadingColor,
    borderRadius: 10,
    opacity: opacitySkeletonAnimation, // Added opacity to the animated styles
  };

  return (
    <View style={{ backgroundColor: 'rgba(51,58,90,0.1)', width: '100%', height: '100%', overflow: 'hidden', justifyContent: 'flex-end', borderRadius: 10 }}>
      <Animated.View style={ViewAnimation} >{/** Image */}</Animated.View>
    </View>
  )
}