import { useColors } from '@context/ThemeContext';
import { View, Animated } from 'react-native'
import { GeneralSkeleton } from './GeneralSkeleton';

export const CardHorizentalSkeleton = () => {
  const { Colors } = useColors();

  return (
    <>
    <View style={{paddingHorizontal: 20, marginTop: 15}}>
        <View 
          style={{flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <View style={[{ marginTop: 0, height: 10, width: '90%' }]}><GeneralSkeleton /></View>
            <View style={[{ marginTop: 10, height: 10, width: '69%' }]}><GeneralSkeleton /></View>
            <View style={[{ marginTop: 10, height: 10, width: '45%' }]}><GeneralSkeleton /></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <View style={{}}></View>
            </View>
          </View>
          <View style={{backgroundColor: 'rgba(51,58,90,0.1)', width: 99, height: 99, overflow: 'hidden', justifyContent: 'flex-end', borderRadius: 10}}>
            <View style={[]} >
              <GeneralSkeleton backgroundColor='rgba(51,58,90,0.4)' />
            </View>
          </View>
        </View>
        <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{backgroundColor: Colors.tagBackground, width: 80, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 5, justifyContent: 'center'}}>
            <View style={{height: 7}}>
              <GeneralSkeleton backgroundColor='rgba(51,58,90,0.7)' />
            </View>
          </View>
          <View style={{width: 40}}>
            <View style={{height: 10}}>
              <GeneralSkeleton backgroundColor='rgba(51,58,90,0.5)' />
            </View>
          </View>
        </View>
      </View>
      <View style={{marginTop: 10, height: 2, width: '100%', backgroundColor: Colors.separator}}></View>
    </>
  )
}
