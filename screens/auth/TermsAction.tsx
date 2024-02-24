import { Text } from "react-native"
import { useLanguage } from '@context/LanguageContext';
import { useColors } from '@context/ThemeContext';
import LanguagesName from "@utils/LanguagesName";
import { useBottomSheet } from "@context/BottomSheetContext";
import { TermScreen } from "@screens/M4/TermScreen";

export const TermsAction = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();
  const { openBottomSheet } = useBottomSheet();

  return (
    <>
      {
        true 
        &&
        <Text style={{ color: Colors.textPrimary, textAlign: 'center' }}>
          بالتسجيل، أنت توافق على {' '}
          <Text
            style={{ textDecorationLine: 'underline' }}
            onPress={() => {openBottomSheet(<TermScreen />)}}
          >
            شروط الخدمة
          </Text>
          {' '}وتقر أن سياسة الخصوصية الخاصة بنا تنطبق عليك.
        </Text>
      }
      {
        languageData === LanguagesName.english 
        &&
        <Text style={{ color: Colors.textPrimary, textAlign: 'center' }}>
          By signing up, you agree to our{' '}
          <Text
            style={{ textDecorationLine: 'underline' }}
            onPress={() => {}}
          >
            Terms of Services
          </Text>
          {' '}and acknowledge that our Privacy Policy applies to you.
        </Text>
      }
    </>
  )
}