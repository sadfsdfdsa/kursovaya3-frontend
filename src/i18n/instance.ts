import messages from './index';
import { createI18n } from 'vue-i18n';
import { defaultLang } from 'src/store/modules/settings';

export const i18n = createI18n({
  locale: defaultLang === 'ru' ? 'ru-RU' : 'en-US',
  messages,
});
