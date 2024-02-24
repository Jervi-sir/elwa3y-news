import { View, Text, Image, Dimensions } from 'react-native'
import { useColors } from '@context/ThemeContext';
import { GeneralSkeleton } from '@components/skeletons/GeneralSkeleton';

const { width } = Dimensions.get('window');

export const CardSingleSkeleton = ({ id }) => {
  const { Colors } = useColors();
  return (
    <>
    <View style={{ marginTop: 10 }} key={id}>
        <View>
          <View style={{ width: (width - 40), height: (width - 60), borderRadius: 10, overflow: 'hidden' }}>
            <GeneralSkeleton />
          </View>
          <View style={{width: '100%', height: 20, marginTop: 20}}>
            <GeneralSkeleton />
          </View>
          <View style={{width: '100%', height: 15, marginTop: 15}}>
            <GeneralSkeleton />
          </View>
          <View style={{width: '50%', height: 10, marginTop: 10}}>
            <GeneralSkeleton />
          </View>
          <View style={{width: '100%', height: 10, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '30%', flexDirection: 'row'}}>
              <View style={{width: '60%', marginRight: 10}}><GeneralSkeleton /></View>
              <View style={{width: '60%'}}><GeneralSkeleton /></View>
            </View>
            <View style={{width: '30%', flexDirection: 'row'}}>
              <GeneralSkeleton />
            </View>
          </View>
        </View>
        <View style={{marginTop: 10, height: 2, backgroundColor: Colors.separator}}></View>
      </View>

    </>
  )
}