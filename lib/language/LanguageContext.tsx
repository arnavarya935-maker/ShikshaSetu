'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Language = 'en' | 'hi';

type Translations = Record<string, string>;

const translations: Record<Language, Translations> = {
  en: {
    // Navbar & Common
    nav_features: 'Features',
    nav_faqs: 'FAQs',
    nav_updates: 'Updates',
    nav_login: 'Login',
    nav_signup: 'Sign up',
    nav_dashboard: 'Dashboard',
    nav_logout: 'Logout',
    brand_name: 'ShikshaSetu',

    // Hero Section
    hero_badge: 'AI-powered learning for modern students',
    hero_title: "Learn smarter, study faster, master anything.",
    hero_subtitle: 'Turn notes, PDFs, and goals into personalized lessons, quizzes, and progress insights without the chaos.',
    hero_cta_start: 'Start free',
    hero_cta_explore: 'Explore the platform',
    hero_stat_powered: 'AI-powered',
    hero_stat_tools: 'Study tools',
    hero_stat_adaptive: 'Adaptive',
    hero_stat_engine: 'Quiz engine',
    hero_stat_support: '24/7',
    hero_stat_ai_support: 'AI support',
    hero_prep_plan: "Today's prep plan",
    hero_get_started: 'Get started today',
    hero_explore_workspace: 'Sign up and explore your AI workspace',

    // Features Listing
    feat_heading: 'Built for AI-powered study',
    feat_subheading: 'Turn every topic into an adaptive learning experience.',
    feat_ai_notes_title: 'AI Notes',
    feat_ai_notes_desc: 'Turn class material into structured summaries, flashcards, and revision points instantly.',
    feat_ai_quiz_title: 'AI Quiz Generator',
    feat_ai_quiz_desc: 'Create adaptive quizzes from any topic, chapter, or uploaded notes in seconds.',
    feat_pdf_title: 'PDF to Quiz',
    feat_pdf_desc: 'Upload a PDF and let the platform convert it into a study-ready quiz flow.',
    feat_doubt_title: 'AI Doubt Solver',
    feat_doubt_desc: 'Get step-by-step explanations for confusing concepts and homework questions.',
    feat_progress_title: 'Progress Tracking',
    feat_progress_desc: 'Monitor streaks, mastery, and completion trends with a clear dashboard view.',
    feat_mock_title: 'Mock Tests',
    feat_mock_desc: 'Practice with realistic timed assessments tailored to your learning goals.',

    // Mid Section Copy
    focus_span: 'Built for focus',
    focus_heading: 'From scattered notes to calm, confident prep.',
    focus_desc: 'Students use ShikshaSetu to study smarter, convert PDFs into engaging quizzes, and stay on top of their goals.',
    focus_workspace_title: 'Your AI study workspace',
    focus_feat_1: 'AI-powered notes',
    focus_feat_2: 'Adaptive quizzes',
    focus_feat_3: 'PDF to quiz',
    focus_feat_4: 'Doubt solver',

    preview_span: 'Product preview',
    preview_heading: 'Everything your study routine needs, built into one intelligent workspace.',
    preview_desc: 'Discover a premium experience with adaptive quizzes, instant doubt support, and clear reports that help every session feel focused.',
    preview_tag_1: 'Adaptive quizzes',
    preview_tag_2: 'Instant doubt help',
    preview_tag_3: 'Smart analytics',
    preview_board_title: 'AI study board',

    // FAQ Section
    faq_heading: 'Frequently asked questions',
    faq_subheading: 'Helpful answers for a smooth start.',
    faq_q1: 'How quickly can I get started?',
    faq_a1: 'You can create an account and begin in just a few minutes.',
    faq_q2: 'Do you offer support during the learning journey?',
    faq_a2: 'Yes. Helpful guidance is available whenever you need a quick answer or a nudge forward.',
    faq_q3: 'Is the experience easy to use on mobile?',
    faq_a3: 'Yes. The experience is designed to feel smooth and clear across phones, tablets, and desktops.',

    // Newsletter Section
    news_span: 'Stay informed',
    news_heading: 'Join the ShikshaSetu newsletter.',
    news_desc: 'Receive course updates, learning tips, and premium offers crafted for ambitious learners.',
    news_email_label: 'Email address',
    news_email_placeholder: 'you@example.com',
    news_subscribe_btn: 'Subscribe',
    news_success_title: 'Thanks for subscribing! 🎉',
    news_success_desc: 'We have registered {email}. You will receive updates as soon as new courses or study tools launch.',

    // Footer
    footer_desc: 'An AI-powered learning platform that helps students turn notes, PDFs, and practice into smarter, calmer progress.',
    footer_col_product: 'Product',
    footer_col_resources: 'Resources',
    footer_col_company: 'Company',
    footer_col_legal: 'Legal',
    footer_link_about: 'About',
    footer_link_contact: 'Contact',
    footer_link_careers: 'Careers',
    footer_link_privacy: 'Privacy',
    footer_link_terms: 'Terms',
    footer_link_cookies: 'Cookies',
    footer_copyright: '© 2026 ShikshaSetu. Crafted for modern learning experiences.',

    // Auth forms
    auth_login_welcome: 'Welcome back',
    auth_login_desc: 'Sign in to continue your learning journey with a calm, simple experience.',
    auth_signup_welcome: 'Create your account',
    auth_signup_desc: 'Join to access a clean learning space with helpful structure and quick guidance.',
    auth_forgot_welcome: 'Reset Password',
    auth_forgot_desc: 'Enter your email to receive a password reset link.',
    auth_name_label: 'Name',
    auth_name_placeholder: 'Your full name',
    auth_email_label: 'Email',
    auth_email_placeholder: 'name@example.com',
    auth_password_label: 'Password',
    auth_password_placeholder: 'Enter your password',
    auth_btn_login: 'Sign in',
    auth_btn_signup: 'Create account',
    auth_btn_forgot: 'Send reset link',
    auth_or: 'or',
    auth_google: 'Continue with Google',
    auth_no_account: 'New here?',
    auth_has_account: 'Already have an account?',
    auth_remember_password: 'Remembered your password?',
    auth_forgot_link: 'Forgot password?',
    auth_email_verified_sent: 'Account created. A verification email has been sent.',
    auth_reset_sent: 'If the email exists, a reset link has been sent.',

    // Onboarding
    onboard_title: 'Tell us about yourself',
    onboard_desc: 'Complete your profile so we can show the right dashboard and content.',
    onboard_banner: 'You’re being redirected here because your profile is not complete yet. Finish onboarding, and you’ll be taken to the dashboard for your selected role.',
    onboard_name_label: 'Full name',
    onboard_institute_label: 'Institute',
    onboard_role_label: 'Role',
    onboard_btn: 'Continue to dashboard',

    // Dashboard Shell & Sidebar
    dash_sidebar_title: 'ShikshaSetu',
    dash_nav_dashboard: 'Dashboard',
    dash_nav_my_courses: 'My Courses',
    dash_nav_explore: 'Explore Courses',
    dash_nav_learning_path: 'Learning Path',
    dash_nav_progress: 'Progress',
    dash_nav_assignments: 'Assignments',
    dash_nav_study_tools: 'Study Tools',
    dash_nav_profile: 'Profile',
    dash_nav_settings: 'Settings',
    dash_upgrade_desc: 'Upgrade to PRO for more features.',
    dash_upgrade_btn: 'Upgrade',
    dash_role_student: 'Student',
    dash_role_teacher: 'Teacher',
    dash_role_admin: 'Admin',
    dash_profile_link: 'My Profile',
    dash_profile_dropdown_signed_in: 'Signed in as',

    // Student Dashboard
    student_greeting: 'Happy Morning',
    greet_morning: 'Good Morning',
    greet_afternoon: 'Good Afternoon',
    greet_evening: 'Good Evening',
    student_goal_desc: 'You have completed 65% of your goal this week! set a new goal and improve your skills.',
    student_courses_title: 'Your Courses',
    student_view_all: 'View All',
    student_schedule_title: 'Class Schedule',
    student_upcoming_courses: 'Upcoming Courses',
    student_event_activities: 'Event Activities',
    student_promo_title: 'Work anywhere with the ShikshaSetu learning App',
    student_promo_play: 'Google Play',
    student_promo_appstore: 'App Store',

    // Certificate card
    cert_title: 'Certificate of Completion',
    cert_certified_that: 'This is to certify that',
    cert_completed_course: 'has successfully completed the course',
    cert_date: 'Date',
    cert_number: 'Certificate No.',
    cert_btn_print: 'Print',
    cert_btn_download: 'Download Certificate (PNG)',
    cert_congrats: 'Congratulations! 🎉',
    cert_congrats_desc: "You've successfully completed",
  },
  hi: {
    // Navbar & Common
    nav_features: 'सुविधाएँ',
    nav_faqs: 'अक्सर पूछे जाने वाले प्रश्न',
    nav_updates: 'अपडेट',
    nav_login: 'लॉगिन',
    nav_signup: 'साइन अप',
    nav_dashboard: 'डैशबोर्ड',
    nav_logout: 'लॉगआउट',
    brand_name: 'शिक्षासेतु',

    // Hero Section
    hero_badge: 'आधुनिक छात्रों के लिए AI-संचालित शिक्षण',
    hero_title: 'स्मार्ट तरीके से सीखें, तेजी से अध्ययन करें, हर विषय में महारत हासिल करें।',
    hero_subtitle: 'बिना किसी उलझन के नोट्स, पीडीएफ और लक्ष्यों को व्यक्तिगत पाठों, क्विज़ और प्रगति अंतर्दृष्टि में बदलें।',
    hero_cta_start: 'मुफ्त शुरू करें',
    hero_cta_explore: 'प्लेटफॉर्म का अन्वेषण करें',
    hero_stat_powered: 'AI-संचालित',
    hero_stat_tools: 'अध्ययन उपकरण',
    hero_stat_adaptive: 'अनुकूलनशील',
    hero_stat_engine: 'क्विज़ इंजन',
    hero_stat_support: '24/7',
    hero_stat_ai_support: 'AI सहायता',
    hero_prep_plan: 'आज की तैयारी योजना',
    hero_get_started: 'आज ही शुरू करें',
    hero_explore_workspace: 'साइन अप करें और अपने AI कार्यक्षेत्र का अन्वेषण करें',

    // Features Listing
    feat_heading: 'AI-संचालित अध्ययन के लिए निर्मित',
    feat_subheading: 'हर विषय को एक अनुकूलनशील सीखने के अनुभव में बदलें।',
    feat_ai_notes_title: 'AI नोट्स',
    feat_ai_notes_desc: 'कक्षा की सामग्री को तुरंत संरचित सारांशों, फ्लैशकार्डों और पुनरीक्षण बिंदुओं में बदलें।',
    feat_ai_quiz_title: 'AI क्विज़ जनरेटर',
    feat_ai_quiz_desc: 'किसी भी विषय, अध्याय या अपलोड किए गए नोट्स से सेकंड में अनुकूलनशील क्विज़ बनाएं।',
    feat_pdf_title: 'पीडीएफ से क्विज़',
    feat_pdf_desc: 'एक पीडीएफ अपलोड करें और प्लेटफॉर्म को इसे अध्ययन के लिए अनुकूल क्विज़ प्रवाह में बदलने दें।',
    feat_doubt_title: 'AI संदेह निवारक',
    feat_doubt_desc: 'भ्रमित करने वाली अवधारणाओं और होमवर्क के प्रश्नों के लिए चरण-दर-चरण स्पष्टीकरण प्राप्त करें।',
    feat_progress_title: 'प्रगति ट्रैकिंग',
    feat_progress_desc: 'एक स्पष्ट डैशबोर्ड दृश्य के साथ निरंतरता, महारत और पूर्णता रुझानों की निगरानी करें।',
    feat_mock_title: 'मॉक टेस्ट',
    feat_mock_desc: 'अपने सीखने के लक्ष्यों के अनुकूल वास्तविक समयबद्ध आकलनों के साथ अभ्यास करें।',

    // Mid Section Copy
    focus_span: 'फोकस के लिए निर्मित',
    focus_heading: 'बिखरे हुए नोट्स से शांत, आत्मविश्वासी तैयारी तक।',
    focus_desc: 'छात्र अधिक स्मार्ट तरीके से अध्ययन करने, पीडीएफ को आकर्षक क्विज़ में बदलने और अपने लक्ष्यों के शीर्ष पर रहने के लिए शिक्षासेतु का उपयोग करते।',
    focus_workspace_title: 'आपका AI अध्ययन कार्यक्षेत्र',
    focus_feat_1: 'AI-संचालित नोट्स',
    focus_feat_2: 'अनुकूलनशील क्विज़',
    focus_feat_3: 'पीडीएफ से क्विज़',
    focus_feat_4: 'संदेह निवारक',

    preview_span: 'उत्पाद पूर्वावलोकन',
    preview_heading: 'एक बुद्धिमान कार्यक्षेत्र में निर्मित वह सब कुछ जिसकी आपकी अध्ययन दिनचर्या को आवश्यकता है।',
    preview_desc: 'अनुकूलनशील क्विज़, त्वरित संदेह सहायता और स्पष्ट रिपोर्टों के साथ एक प्रीमियम अनुभव की खोज करें जो हर सत्र को केंद्रित महसूस करने में मदद करता है।',
    preview_tag_1: 'अनुकूलनशील क्विज़',
    preview_tag_2: 'त्वरित संदेह सहायता',
    preview_tag_3: 'स्मार्ट एनालिटिक्स',
    preview_board_title: 'AI अध्ययन बोर्ड',

    // FAQ Section
    faq_heading: 'अक्सर पूछे जाने वाले प्रश्न',
    faq_subheading: 'एक सुचारू शुरुआत के लिए सहायक उत्तर।',
    faq_q1: 'मैं कितनी जल्दी शुरुआत कर सकता हूँ?',
    faq_a1: 'आप बस कुछ ही मिनटों में एक खाता बना सकते हैं और शुरुआत कर सकते हैं।',
    faq_q2: 'क्या आप सीखने की यात्रा के दौरान सहायता प्रदान करते हैं?',
    faq_a2: 'हाँ। जब भी आपको त्वरित उत्तर या आगे बढ़ने के लिए प्रेरणा की आवश्यकता हो, सहायक मार्गदर्शन उपलब्ध है।',
    faq_q3: 'क्या मोबाइल पर इसका उपयोग करना आसान है?',
    faq_a3: 'हाँ। यह अनुभव फोन, टैबलेट और डेस्कटॉप पर सुचारू और स्पष्ट महसूस होने के लिए डिज़ाइन किया गया है।',

    // Newsletter Section
    news_span: 'सूचित रहें',
    news_heading: 'शिक्षासेतु न्यूज़लेटर में शामिल हों।',
    news_desc: 'महत्वाकांक्षी शिक्षार्थियों के लिए तैयार किए गए पाठ्यक्रम अपडेट, सीखने के टिप्स और प्रीमियम ऑफ़र प्राप्त करें।',
    news_email_label: 'ईमेल पता',
    news_email_placeholder: 'you@example.com',
    news_subscribe_btn: 'सदस्यता लें',
    news_success_title: 'सदस्यता लेने के लिए धन्यवाद! 🎉',
    news_success_desc: 'हमने {email} पंजीकृत कर लिया है। नए पाठ्यक्रम या अध्ययन उपकरण लॉन्च होते ही आपको अपडेट प्राप्त होंगे।',

    // Footer
    footer_desc: 'एक AI-संचालित शिक्षण मंच जो छात्रों को नोट्स, पीडीएफ और अभ्यास को अधिक स्मार्ट, शांत प्रगति में बदलने में मदद करता है।',
    footer_col_product: 'उत्पाद',
    footer_col_resources: 'संसाधन',
    footer_col_company: 'कंपनी',
    footer_col_legal: 'कानूनी',
    footer_link_about: 'हमारे बारे में',
    footer_link_contact: 'संपर्क करें',
    footer_link_careers: 'करियर',
    footer_link_privacy: 'गोपनीयता',
    footer_link_terms: 'शर्तें',
    footer_link_cookies: 'कुकीज़',
    footer_copyright: '© 2026 शिक्षासेतु। आधुनिक शिक्षण अनुभवों के लिए निर्मित।',

    // Auth forms
    auth_login_welcome: 'वापसी पर स्वागत है',
    auth_login_desc: 'एक शांत, सरल अनुभव के साथ अपनी सीखने की यात्रा जारी रखने के लिए साइन इन करें।',
    auth_signup_welcome: 'अपना खाता बनाएं',
    auth_signup_desc: 'मददगार संरचना और त्वरित मार्गदर्शन के साथ एक साफ सीखने के स्थान तक पहुंचने के लिए जुड़ें।',
    auth_forgot_welcome: 'पासवर्ड रीसेट करें',
    auth_forgot_desc: 'पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें।',
    auth_name_label: 'नाम',
    auth_name_placeholder: 'आपका पूरा नाम',
    auth_email_label: 'ईमेल',
    auth_email_placeholder: 'name@example.com',
    auth_password_label: 'पासवर्ड',
    auth_password_placeholder: 'अपना पासवर्ड दर्ज करें',
    auth_btn_login: 'साइन इन करें',
    auth_btn_signup: 'खाता बनाएं',
    auth_btn_forgot: 'रीसेट लिंक भेजें',
    auth_or: 'या',
    auth_google: 'Google के साथ जारी रखें',
    auth_no_account: 'यहाँ नए हैं?',
    auth_has_account: 'पहले से ही एक खाता है?',
    auth_remember_password: 'अपना पासवर्ड याद आया?',
    auth_forgot_link: 'पासवर्ड भूल गए?',
    auth_email_verified_sent: 'खाता बन गया। एक सत्यापन ईमेल भेजा गया है।',
    auth_reset_sent: 'यदि ईमेल मौजूद है, तो एक रीसेट लिंक भेज दिया गया है।',

    // Onboarding
    onboard_title: 'हमें अपने बारे में बताएं',
    onboard_desc: 'अपना प्रोफ़ाइल पूरा करें ताकि हम सही डैशबोर्ड और सामग्री दिखा सकें।',
    onboard_banner: 'आपको यहाँ इसलिए पुनर्निर्देशित किया जा रहा है क्योंकि आपका प्रोफ़ाइल अभी तक पूरा नहीं हुआ है। ऑनबोर्डिंग समाप्त करें, और आपको आपकी चुनी हुई भूमिका के डैशबोर्ड पर ले जाया जाएगा।',
    onboard_name_label: 'पूरा नाम',
    onboard_institute_label: 'संस्थान',
    onboard_role_label: 'भूमिका',
    onboard_btn: 'डैशबोर्ड पर जारी रखें',

    // Dashboard Shell & Sidebar
    dash_sidebar_title: 'शिक्षासेतु',
    dash_nav_dashboard: 'डैशबोर्ड',
    dash_nav_my_courses: 'मेरे पाठ्यक्रम',
    dash_nav_explore: 'पाठ्यक्रमों का अन्वेषण करें',
    dash_nav_learning_path: 'सीखने का मार्ग',
    dash_nav_progress: 'प्रगति',
    dash_nav_assignments: 'असाइनमेंट',
    dash_nav_study_tools: 'अध्ययन उपकरण',
    dash_nav_profile: 'प्रोफ़ाइल',
    dash_nav_settings: 'सेटिंग्स',
    dash_upgrade_desc: 'अधिक सुविधाओं के लिए प्रो में अपग्रेड करें।',
    dash_upgrade_btn: 'अपग्रेड करें',
    dash_role_student: 'छात्र',
    dash_role_teacher: 'शिक्षक',
    dash_role_admin: 'एडमिन',
    dash_profile_link: 'मेरी प्रोफ़ाइल',
    dash_profile_dropdown_signed_in: 'के रूप में हस्ताक्षरित',

    // Student Dashboard
    student_greeting: 'शुभ प्रभात',
    greet_morning: 'शुभ प्रभात',
    greet_afternoon: 'शुभ दोपहर',
    greet_evening: 'शुभ संध्या',
    student_goal_desc: 'आपने इस सप्ताह अपने लक्ष्य का 65% पूरा कर लिया है! एक नया लक्ष्य निर्धारित करें और अपने कौशल में सुधार करें।',
    student_courses_title: 'आपके पाठ्यक्रम',
    student_view_all: 'सभी देखें',
    student_schedule_title: 'कक्षा समय-सारणी',
    student_upcoming_courses: 'आगामी पाठ्यक्रम',
    student_event_activities: 'इवेंट गतिविधियां',
    student_promo_title: 'शिक्षासेतु लर्निंग ऐप के साथ कहीं भी काम करें',
    student_promo_play: 'गूगल प्ले',
    student_promo_appstore: 'ऐप स्टोर',

    // Certificate card
    cert_title: 'पूर्णता का प्रमाण पत्र',
    cert_certified_that: 'यह प्रमाणित किया जाता है कि',
    cert_completed_course: 'ने सफलतापूर्वक पाठ्यक्रम पूरा कर लिया है',
    cert_date: 'दिनांक',
    cert_number: 'प्रमाण पत्र संख्या',
    cert_btn_print: 'प्रिंट करें',
    cert_btn_download: 'प्रमाण पत्र डाउनलोड करें (PNG)',
    cert_congrats: 'बधाई हो! 🎉',
    cert_congrats_desc: 'आपने सफलतापूर्वक पूरा कर लिया है',
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('language');
      if (stored === 'hi' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch (e) {
      console.warn('Failed to load language from localStorage:', e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.warn('Failed to save language in localStorage:', e);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
