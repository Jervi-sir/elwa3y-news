import { useRef, useCallback, useState, useContext, useMemo, createContext } from 'react';
import { View, Text, Dimensions, StatusBar, Platform } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useColors } from './ThemeContext';

export const BottomSheetContext = createContext(null);

export const useBottomSheet = () => {
  return useContext(BottomSheetContext);
};

export const BottomSheetProvider = ({ children }) => {
  const bottomSheetModalRef = useRef(null);
  const [contentStack, setContentStack] = useState([]); // Use a stack to manage multiple contents
  const { Colors } = useColors();
  const [snapPoints, setSnapPoints] = useState(['50%', '75%', '95%']);

  const openBottomSheet = useCallback((content, customSnapPoints) => {
    setContentStack((prevStack) => [...prevStack, content]); // Push new content onto the stack
    if (customSnapPoints) {
      setSnapPoints(customSnapPoints);
    } else {
      setSnapPoints(['50%', '75%', '95%']);
    }
    bottomSheetModalRef.current?.present();
  }, []);

  const popContent = useCallback(() => {
    setContentStack((prevStack) => prevStack.slice(0, -1)); // Pop the top content off the stack
  }, []);

  const onClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setContentStack([]); // Clear the stack when the Bottom Sheet is closed
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );
  const currentContent = contentStack[contentStack.length - 1] || null; // Get the current (top) content from the stack

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, onClose, popContent }}>
      <BottomSheetModalProvider>
        {children}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={(index) => {
            if (index === -1) {
              setContentStack([]); // Optionally reset the content stack on close
            }
          }}
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: Colors.background
          }}
          handleIndicatorStyle={{
            backgroundColor: Colors.textPrimary
          }}
        >
          <View style={{backgroundColor: Colors.background}}>
            {currentContent}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  );
};
