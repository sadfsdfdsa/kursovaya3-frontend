import { reactive, computed } from 'vue';

type State = {
  firstName: string;
  secondName: string;
  email: string;
};

const createState = (): State => ({
  firstName: '',
  secondName: '',
  email: '',
});

export type User = {
  firstName: string;
  secondName: string;
  patronymic: string;
  login: string;
  password: string;
}

const state = reactive<State>(createState());

const mutations = {
  setFirstName: (value: State['firstName']) => {
    state.firstName = value;
  },
  setSecondName: (value: State['secondName']) => {
    state.secondName = value;
  },
  setEmail: (value: State['email']) => {
    state.email = value;
  },
};

export const actions = {
  disposeState: () => {
    mutations.setFirstName('');
    mutations.setSecondName('');
    mutations.setEmail('');
  },
  fillState: (userInfo: State) => {
    mutations.setFirstName(userInfo.firstName);
    mutations.setSecondName(userInfo.secondName);
    mutations.setEmail(userInfo.email);
  },
  createUser: (user: User) => {
    console.warn('asd 1', user);
  },
};

export const getters = {
  username: computed(() => {
    return `${state.secondName} ${state.firstName}`;
  }),
};
