import { readonly, reactive, computed } from 'vue';
import { Dark } from 'quasar';
import { i18n } from 'src/i18n/instance';

type State = {
  theme: 'light' | 'dark';
  lang: 'ru' | 'en';
};

const defaultTheme: State['theme'] = 'light';
export const defaultLang: State['lang'] = 'ru';

const createState = (): State => ({
  theme: defaultTheme,
  lang: defaultLang,
});

const langLocalStorageKey = 'lang';
const themeLocalStorageKey = 'theme';

const state = reactive<State>(createState());

const mutations = {
  setTheme: (value: State['theme']): void => {
    state.theme = value;
    localStorage.setItem(themeLocalStorageKey, value);
  },
  setLang: (value: State['lang']): void => {
    state.lang = value;
    localStorage.setItem(langLocalStorageKey, value);
  },
};

export const actions = {
  changeTheme: (): void => {
    if (state.theme === 'dark') {
      mutations.setTheme('light');
      Dark.set(false);
      return;
    }

    mutations.setTheme('dark');
    Dark.set(true);
  },
  changeLang: (): void => {
    if (state.lang === 'ru') {
      mutations.setLang('en');
      i18n.global.locale = 'en-US';
      return;
    }

    mutations.setLang('ru');
    i18n.global.locale = 'ru-RU';
  },
  loadSettingsFromLocalStorage: (): void => {
    const theme = localStorage.getItem(themeLocalStorageKey);
    const lang = localStorage.getItem(langLocalStorageKey);

    if (theme && theme !== defaultTheme) actions.changeTheme();
    if (lang && lang !== defaultLang) actions.changeLang();
  },
};

export const getters = {
  theme: computed(() => readonly(state).theme),
  lang: computed(() => readonly(state).lang),
  invertLang: computed(() => (readonly(state).lang === 'ru' ? 'en' : 'ru')),
};
