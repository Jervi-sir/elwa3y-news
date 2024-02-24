import { useColors } from '@context/ThemeContext';
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type AccordionItemPros = PropsWithChildren<{
  title: string;
}>;

function CollapsibleView({ children, title }: AccordionItemPros) {
  const [ expanded, setExpanded ] = useState(false);
  const { Colors } = useColors();

  function toggleItem() {
    setExpanded(!expanded);
  }
  const body = <View style={{padding: 12}}>{ children }</View>;

  return (
    <View style={{backgroundColor: Colors.background, paddingBottom: 5}}>
      <TouchableOpacity 
        style={{ backgroundColor: Colors.background, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }} 
        onPress={ toggleItem }
        activeOpacity={1} 
      >
        <>
          <Icon name={ expanded ? 'chevron-up' : 'chevron-down' } size={20} color={Colors.textWarning} />
          <Text style={{ color: Colors.textPrimary }}>{ title }</Text>
        </>
      </TouchableOpacity>
      <View style={{backgroundColor: Colors.background}}>
      { expanded && body }
      </View>
    </View>
  );
};

export default CollapsibleView;
