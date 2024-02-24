import React, { createContext, useContext, useState } from 'react';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const languages = {
    arabic: ArabicLanguage,
    // Add more languages here like 'english': EnglishLanguage,
  };

  const [currentLanguage, setCurrentLanguage] = useState('arabic'); // Set initial language to Arabic
  const [languageData, setLanguageData] = useState(languages[currentLanguage]);

  // Function to change language
  const changeLanguage = (language) => {
    if (languages[language]) {
      setCurrentLanguage(language);
      setLanguageData(languages[language]);
    }
  };

  return (
    <LanguageContext.Provider value={{ languageData, changeLanguage, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};

const ArabicLanguage = {
  home: 'الوعي',
  read: 'اقرأ',
  explore: 'استكشاف',
  related_posts: 'مقالات ذات صلة',
  saved: 'المحفوظات',
  get_news: 'احصل على الأخبار',
  refresh: 'تحديث',
  edit_your_profile: 'تعديل الملف الشخصي',
  configure_the_app: 'تكوين التطبيق',
  edit_profile: 'تعديل الملف',
  light_theme: 'الوضع الفاتح',
  push_notifications: 'إشعارات',
  Notifications: 'إشعارات',
  about_the_app: 'عن التطبيق',
  terms_of_services: 'شروط الخدمة',
  privacy_policy: 'سياسة الخصوصية',
  app_controls: 'إعدادات التطبيق',
  clear_all_caches: 'مسح جميع البيانات المؤقتة',
  clear_all: 'مسح الكل',
  sign_out: 'تسجيل الخروج',
  username: 'اسم المستخدم',
  first_name: 'الاسم الأول',
  last_name: 'الاسم الأخير',
  email: 'البريد الإلكتروني',
  bio: 'السيرة الذاتية',
  save: 'حفظ',
  delete: 'مسح',
  confirm_delete: 'هل متأكد من مسح هذا التعليق؟',
  about_us: 'عنا',
  search: 'بحث',
  chooseImage: 'اختر صورة',
  login: 'تسجيل الدخول',
  create_an_account: 'إنشاء حساب',
  welcome_back: 'مرحباً مجدداً',
  phone_number: 'رقم الهاتف',
  password: 'كلمة المرور',
  or: 'أو',
  app_name: 'الوعي',
  create_account: 'إنشاء حساب',
  warning: 'تحذير',
  confirmClearCache: 'هل أنت متأكد من حذف جميع المقالات المحفوظة؟', // Are you sure to delete all saved articles?
  confirmClearCacheNotifications: 'هل أنت متأكد من حذف جميع الإشعارات؟', // Are you sure to delete all saved articles?
  confirmLogout: 'هل أنت متأكد من الخروج؟',
  deleteAll: 'حذف الكل',
  cancel: 'إلغاء',
  yes: 'نعم',
  comments: 'تعليقات',
  edit: 'تعديل',
  years_ago: '',
  months_ago: '',
  weeks_ago: '',
  days_ago: '',
  minutes_ago: '',
  seconds_ago: '',
  dont_have_account: 'ليس لديك حساب ؟',
  already_have_account: 'لديك حساب بالفعل ؟',
  login_here: 'تسجيل الدخول من هنا',
  register_here: 'التسجيل من هنا',
};
