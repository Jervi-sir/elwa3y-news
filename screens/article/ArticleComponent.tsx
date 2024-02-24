import { ImageLargeSkeleton } from '@components/skeletons/ImageLargeSkeleton';
import { TextSkeleton } from '@components/skeletons/TextSkeleton';
import { useColors } from '@context/ThemeContext';
import { memo, useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native'
import RenderHTML from 'react-native-render-html';

const { width } = Dimensions.get('window');

export const ArticleComponent = memo(function ArticleComponent({ item }) {
  const { Colors } = useColors();

  return (
    <>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ width: (width - 40), height: (width - 60), borderRadius: 10, overflow: 'hidden' }}>
          <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: '100%' }} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{flexDirection: 'row'}}>
            <Image source={require('@assets/star.png')} style={{ width: 15, height: 15, marginRight: 15 }} />
            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{item.category_name}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, marginHorizontal: 20 }}>{item.duration} read</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>{item.uploaded_since}</Text>
          </View>
        </View>
        <Text style={{ marginTop: 20, fontSize: 25, fontWeight: "800", color: Colors.textSecondary, textAlign: 'right' }}>{item.title}</Text>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
        <RenderHTML
          contentWidth={100}
          source={{ html: item.content }}
          baseStyle={{ color: Colors.textPrimary }}
          tagsStyles={{
            h1: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h2: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h3: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h4: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h5: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            p: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' }
          }}
        />
        <RenderHTML
          contentWidth={100}
          source={{ html: item.content }}
          baseStyle={{ color: Colors.textPrimary }}
          tagsStyles={{
            h1: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h2: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h3: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h4: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            h5: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' },
            p: { padding: 0, margin: 0, marginBottom: 2, textAlign: 'right' }
          }}
  
        />
      </View>
    </>
  )
});

 