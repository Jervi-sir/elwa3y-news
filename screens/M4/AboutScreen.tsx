import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { useColors } from '@context/ThemeContext';
import Entypo from 'react-native-vector-icons/Entypo';
import { useLanguage } from '@context/LanguageContext';

export const AboutScreen = () => {
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
      marginBottom: 15,
      color: Colors.textSecondary
    },
  });

  return (
    <>
      <View style={{ height: 69, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center', color: Colors.textPrimary }}>{ languageData.about_us }</Text>
      </View>
      <View style={styles.container}>
        <View>
          <BodyArabic styles={styles} />
        </View>
      </View>
    </>
  )
}

const BodyArabic = ({ styles }) => {
  const { Colors } = useColors();
  return (
    <>
      <View style={{ flexDirection: 'row', paddingVertical: 20, justifyContent: 'flex-end' }}>
        <Text style={{ color: Colors.textPrimary, fontWeight: '800', fontSize: 25,  }}>الوعي</Text>
        <Text style={{ color: Colors.textPrimary, fontWeight: '800', fontSize: 25,  }}>أخبار</Text>
      </View>
      <Text style={{...styles.text, textAlign: 'right'}}>
        مرحباً بكم في تطبيقنا المحمول للأخبار! نحن مصدر موثوق للأخبار، التحليل، والتعليق، نقدم صحافة عالية الجودة لقرائنا. مهمتنا هي إبلاغ، وإشراك، وإلهام من خلال التقرير الشامل والدقيق.
      </Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        فريقنا من الصحفيين والمحررين ذوي الخبرة يعملون بلا كلل لجلب لكم أحدث الأخبار من جميع أنحاء العالم. نغطي مجموعة واسعة من الموضوعات، بما في ذلك السياسة، الأعمال، التكنولوجيا، الثقافة، وأكثر. هدفنا هو توفير معلومات ذات صلة ورؤى ثاقبة لكي تظلوا على اطلاع وتتخذوا قرارات مستنيرة.
      </Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        نحن نقدر الشفافية، والموضوعية، والتقارير الأخلاقية. نحن ملتزمون بمحاسبة أنفسنا أمام قرائنا والحفاظ على أعلى معايير النزاهة الصحفية.
      </Text>
      <Text style={{...styles.text, textAlign: 'right'}}>
        شكراً لاختياركم لنا كمصدركم الموثوق للأخبار. نقدر دعمكم ونتطلع إلى خدمتكم بصحافة موثوقة وجذابة.
      </Text>
    </>
  )
}

const BodyEnglish = ({ styles }) => {
  const { Colors } = useColors();
  return (
    <>
      <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
        <Text style={{ color: Colors.textPrimary, fontWeight: '800', fontSize: 25 }}>Elwa3y</Text>
        <Text style={{ color: Colors.textPrimary, fontWeight: '800', fontSize: 25 }}>News</Text>
      </View>
      <Text style={styles.text}>
        Welcome to our News Journal mobile app! We are a trusted source of
        news, analysis, and commentary, delivering high-quality journalism to
        our readers. Our mission is to inform, engage, and inspire through
        comprehensive and accurate reporting.
      </Text>
      <Text style={styles.text}>
        Our team of experienced journalists and editors work tirelessly to
        bring you the latest news from around the world. We cover a wide
        range of topics, including politics, business, technology, culture,
        and more. Our aim is to provide you with relevant and insightful
        information to stay informed and make informed decisions.
      </Text>
      <Text style={styles.text}>
        We value transparency, objectivity, and ethical reporting. We are
        committed to holding ourselves accountable to our readers and
        upholding the highest standards of journalistic integrity.
      </Text>
      <Text style={styles.text}>
        Thank you for choosing us as your trusted news source. We appreciate
        your support and look forward to serving you with reliable and
        compelling journalism.
      </Text>
    </>
  )
}
