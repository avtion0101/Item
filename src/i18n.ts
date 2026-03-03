import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Pet Haven',
          adopt: 'Adopt a Pet',
          community: 'Community',
          donate: 'Donate',
          about: 'About Us'
        }
      },
      zh: {
        translation: {
          welcome: '欢迎来到宠乐园',
          adopt: '领养中心',
          community: '交流中心',
          donate: '捐赠支持',
          about: '关于我们'
        }
      }
    }
  })

export default i18n
