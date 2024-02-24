import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { useColors } from '@context/ThemeContext';
import Entypo from 'react-native-vector-icons/Entypo';
import { useLanguage } from '@context/LanguageContext';

export const TermScreen = () => {
  const { Colors } = useColors();
  const { languageData } = useLanguage();

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      paddingHorizontal: 20,
      backgroundColor: Colors.background
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: Colors.textPrimary
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: Colors.textPrimary
    },
    text: {
      fontSize: 16,
      textAlign: 'justify',
      marginBottom: 10,
      color: Colors.textSecondary
    },
  });

  return (
    <>
      <View style={{ height: 69, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center', color: Colors.textPrimary }}>{ languageData.terms_of_services }</Text>
      </View>
      <ScrollView style={styles.container}>
        <BodyArabic styles={styles} />
        <View style={{ height: 140 }}></View>
      </ScrollView>
    </>
  )
}

const BodyArabic = ({ styles }) => {
  return (
    <>
      <Text style={{...styles.text, textAlign: 'right'}}>
        بإستخدامك لتطبيقنا المحمول ("التطبيق")، أنت توافق على الالتزام بالشروط والأحكام التالية للإستخدام. يرجى مراجعة هذه الشروط بعناية. إذا لم توافق على هذه الشروط، يجب ألا تستخدم هذا التطبيق.
      </Text>
      <Text style={{...styles.sectionTitle, textAlign: 'right'}}>1. قبول الاتفاقية</Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        توافق على الشروط والأحكام المحددة في هذه اتفاقية شروط الإستخدام ("الاتفاقية") بخصوص التطبيق الخاص بنا. تعتبر هذه الاتفاقية هي الاتفاقية الوحيدة والكاملة بيننا وبينك، وتحل محل جميع الاتفاقيات، والتصريحات، والضمانات، والفهم المسبق أو المعاصر بخصوص التطبيق وموضوع هذه الاتفاقية.
      </Text>
      <Text style={{...styles.sectionTitle, textAlign: 'right'}}>2. ملكية المحتوى</Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        جميع المحتوى الموجود في التطبيق الخاص بنا، مثل النصوص، الرسومات، الشعارات، الصور، والبرمجيات، هو ملك لمنظمتنا أو موردي المحتوى الخاص بها ومحمي بموجب قوانين حقوق النشر الدولية.
      </Text>
      <Text style={{...styles.sectionTitle, textAlign: 'right'}}>3. القيود على الاستخدام</Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        يجب ألا تنسخ، أو توزع، أو تعدل، أو تنشئ أعمالا مشتقة من، أو تعرض علنيا، أو تقدم عرضا عاما، أو تنشر، أو تخزن، أو تنقل أيا من المواد على التطبيق الخاص بنا دون موافقتنا المسبقة والكتابية.
      </Text>
      <Text style={{...styles.sectionTitle, textAlign: 'right'}}>4. تحديد المسؤولية</Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        لن نكون مسؤولين في أي حالة عن أي أضرار مباشرة، أو غير مباشرة، أو خاصة، أو عرضية، أو تبعية تتعلق باستخدامك أو عدم قدرتك على استخدام التطبيق، بما في ذلك وليس حصريا، الأرباح المفقودة، فقدان البيانات، أو تعطيل الأعمال.
      </Text>
      <Text style={{...styles.sectionTitle, textAlign: 'right'}}>5. تغييرات في الشروط</Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        قد نقوم بمراجعة وتحديث شروط الاستخدام هذه من وقت لآخر وفقا لتقديرنا الخاص. يعتبر جميع التغييرات نافذة فور نشرها. استمرارك في استخدام التطبيق بعد نشر الشروط المعدلة يعني أنك تقبل وتوافق على التغييرات.
      </Text>
    </>
  )
}

const BodyEnglish = ({ styles }) => {
  return (
    <>
      <Text style={styles.text}>
        By using our mobile app ("App"), you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not use this App.
      </Text>
      <Text style={styles.sectionTitle}>1. Acceptance of Agreement</Text>
      <Text style={styles.text}>
        You agree to the terms and conditions outlined in this Terms of Use Agreement ("Agreement") concerning our App. This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties, and understandings concerning the App and the subject matter of this Agreement.
      </Text>
      <Text style={styles.sectionTitle}>2. Content Ownership</Text>
      <Text style={styles.text}>
        All content included on our App, such as text, graphics, logos, images, and software, is the property of our organization or its content suppliers and protected by international copyright laws.
      </Text>
      <Text style={styles.sectionTitle}>3. Restrictions on Use</Text>
      <Text style={styles.text}>
        You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our App without our prior written consent.
      </Text>
      <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
      <Text style={styles.text}>
        In no event will we be liable for any direct, indirect, special, incidental, or consequential damages related to your use of or inability to use our App, including but not limited to lost profits, data loss, or business interruption.
      </Text>
      <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
      <Text style={styles.text}>
        We may revise and update these terms of use from time to time at our sole discretion. All changes are effective immediately when we post them. Your continued use of the App following the posting of revised terms means that you accept and agree to the changes.
      </Text>
    </>
  )
}
