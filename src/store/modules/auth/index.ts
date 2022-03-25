import { readonly, reactive, computed } from 'vue';
import {
  actions as userActions,
  getters as userGetters,
} from 'src/store/modules/user';
import { Router } from 'src/router';
import { Notify } from 'quasar';
import { i18n } from 'src/i18n/instance';
import { api } from 'src/boot/axios';

type State = {
  accessToken: string | null;
  isAuthorized: boolean;
  isAdmin: boolean;
};

const createState = (): State => ({
  accessToken: null,
  isAuthorized: false,
  isAdmin: false,
});

const accessTokenLocalStorageKey = 'access_token';

const state = reactive<State>(createState());

const mutations = {
  setAuthorized: (value: State['isAuthorized']): void => {
    state.isAuthorized = value;

    if (!value) {
      mutations.setAccessToken(null);
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

    localStorage.removeItem(accessTokenLocalStorageKey);
  },
};

export const actions = {
  loginByToken: async (): Promise<void> => {
    if (!state.accessToken) throw Error('Auth error, need login');

    try {
      const res = await api.get('/profile');
      console.warn('ASD 1 login by token', res);

      mutations.setAuthorized(true);
      mutations.setAdmin(true);
      userActions.fillState(res.data);
    } catch (e) {
      throw Error('Auth error, need login');
    }
  },
  loginByLoginAndPass: async (
    login: string,
    password: string
  ): Promise<void> => {
    try {
      const res = await api.post('/auth/login', {
        username: login,
        password,
      });

      mutations.setAuthorized(true);
      userActions.fillState(res.data);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accessToken = res.data.access_token as string;
      actions.setTokens({
        access_token: accessToken,
      });

      Notify.create({
        color: 'green-5',
        textColor: 'white',
        icon: 'done',
        message: `${i18n.global.t('welcome')} ${userGetters.username.value}!`,
        position: 'bottom-right',
      });

      await actions.loginByToken();

      Router.push({ name: 'Main' }).catch(console.error);
    } catch (e) {
      throw Error('Auth error, invalid creds');
    }
  },
  logout: (): void => {
    mutations.setAuthorized(false);
    userActions.disposeState();

    Router.push({ name: 'Login' }).catch(console.error);
  },
  setTokens: (payload: { access_token: State['accessToken'] }): void => {
    mutations.setAccessToken(payload.access_token);
  },
  loadToken: (): void => {
    const accessToken = localStorage.getItem(accessTokenLocalStorageKey);

    mutations.setAccessToken(accessToken, true);
  },
};

export const getters = {
  isAdmin: computed(() => readonly(state).isAdmin),
  isAuthorized: computed(() => readonly(state).isAuthorized),
  accessToken: computed(() => readonly(state).accessToken),
};
