import { readonly, reactive, computed } from 'vue';
import {
  actions as userActions,
  getters as userGetters,
} from 'src/store/modules/user';
import { Router } from 'src/router';
import { Notify } from 'quasar';
import { i18n } from 'src/i18n/instance';
import { nanoid } from 'nanoid';

type State = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthorized: boolean;
  isAdmin: boolean;
};

const createState = (): State => ({
  accessToken: null,
  refreshToken: null,
  isAuthorized: false,
  isAdmin: false,
});

const mockUserInfo = {
  firstName: 'Artem',
  secondName: 'Shuvaev',
  phone: '682934329',
  email: 'sh@mail.ru',
  isAdmin: true,
};

const accessTokenLocalStorageKey = 'access_token';
const refreshTokenLocalStorageKey = 'refresh_token';

const state = reactive<State>(createState());

const mutations = {
  setAuthorized: (value: State['isAuthorized']): void => {
    state.isAuthorized = value;

    if (!value) {
      mutations.setAccessToken(null);
      mutations.setRefreshToken(null);
      state.isAdmin = false;
    }
  },
  setAdmin: (value: State['isAdmin']): void => {
    state.isAdmin = value;
  },
  setAccessToken: (value: State['accessToken'], stateOnly = false): void => {
    state.accessToken = value;
    if (stateOnly) return;

    if (value) {
      localStorage.setItem(accessTokenLocalStorageKey, value);
      return;
    }
    console.warn('ASD 2', value);
    localStorage.removeItem(accessTokenLocalStorageKey);
  },
  setRefreshToken: (value: State['refreshToken'], stateOnly = false): void => {
    state.refreshToken = value;
    if (stateOnly) return;

    if (value) {
      localStorage.setItem(refreshTokenLocalStorageKey, value);
      return;
    }
    console.warn('ASD 2.2', value);

    localStorage.removeItem(refreshTokenLocalStorageKey);
  },
};

export const actions = {
  loginByToken: (): void => {
    // TODO get userInfo from backend
    if (!state.accessToken) throw Error('Auth error, need login');
    mutations.setAuthorized(true);
    mutations.setAdmin(true);
    userActions.fillState(mockUserInfo);
  },
  loginByLoginAndPass: (login: string, password: string): void => {
    if (login !== 'asd@asd.com' || password !== 'asd')
      throw Error('Invalid creditinals');

    mutations.setAuthorized(true);
    mutations.setAdmin(true);
    userActions.fillState(mockUserInfo);

    // TODO remove
    const accessToken = nanoid();
    const refreshToken = nanoid();
    actions.setTokens({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    Notify.create({
      color: 'green-5',
      textColor: 'white',
      icon: 'done',
      message: `${i18n.global.t('welcome')} ${userGetters.username.value}!`,
      position: 'bottom-right',
    });

    Router.push({ name: 'Main' }).catch(console.error);
  },
  logout: (): void => {
    mutations.setAuthorized(false);
    userActions.disposeState();

    Router.push({ name: 'Login' }).catch(console.error);
  },
  setTokens: (payload: {
    access_token: State['accessToken'];
    refresh_token: State['refreshToken'];
  }): void => {
    mutations.setAccessToken(payload.access_token);
    mutations.setRefreshToken(payload.refresh_token);
  },
  loadTokens: (): void => {
    const accessToken = localStorage.getItem(accessTokenLocalStorageKey);
    const refreshToken = localStorage.getItem(refreshTokenLocalStorageKey);

    mutations.setAccessToken(accessToken, true);
    mutations.setRefreshToken(refreshToken, true);
  },
};

export const getters = {
  isAdmin: computed(() => readonly(state).isAdmin),
  isAuthorized: computed(() => readonly(state).isAuthorized),
  accessToken: computed(() => readonly(state).accessToken),
  refreshToken: computed(() => readonly(state).refreshToken),
};
