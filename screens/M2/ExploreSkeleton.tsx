import { CardSingleSkeleton } from '@components/skeletons/CardSingleSkeleton'
import { GeneralSkeleton } from '@components/skeletons/GeneralSkeleton'
import { View, Text, ScrollView, Animated, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator, RefreshControl, Easing, Alert } from 'react-native'


export const ExploreSkeleton = () => {
  return (
    <>
      <FlatList
        data={[0, 1, 2, 3, 4]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginVertical: 10 }}>
            <CardSingleSkeleton id={index} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={{ height: 20, width: '100%', marginTop: 20, flexDirection: 'row' }}>
            <View style={{ marginRight: 10, width: '35%' }} key={1}><GeneralSkeleton /></View>
            <View style={{ marginRight: 10, width: '25%' }} key={2}><GeneralSkeleton /></View>
            <View style={{ marginRight: 10, width: '20%' }} key={3}><GeneralSkeleton /></View>
            <View style={{ marginRight: 10, width: '10%' }} key={4}><GeneralSkeleton /></View>
          </View>
        )}
      />
    </>
  )
}