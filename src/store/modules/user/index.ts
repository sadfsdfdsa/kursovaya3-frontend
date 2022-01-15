import { reactive, computed } from 'vue';

type State = {
  firstName: string;
  secondName: string;
  phone: string;
  email: string;
};

const createState = (): State => ({
  firstName: '',
  secondName: '',
  phone: '',
  email: '',
});

const state = reactive<State>(createState());

const mutations = {
  setFirstName: (value: State['firstName']) => {
    state.firstName = value;
  },
  setSecondName: (value: State['secondName']) => {
    state.secondName = value;
  },
  setPhone: (value: State['phone']) => {
    state.phone = value;
  },
  setEmail: (value: State['email']) => {
    state.email = value;
  },
};

export const actions = {
  disposeState: () => {
    mutations.setFirstName('');
    mutations.setSecondName('');
    mutations.setPhone('');
    mutations.setEmail('');
  },
  fillState: (userInfo: State) => {
    mutations.setFirstName(userInfo.firstName);
    mutations.setSecondName(userInfo.secondName);
    mutations.setPhone(userInfo.phone);
    mutations.setEmail(userInfo.email);
  },
};

export const getters = {
  username: computed(() => {
    return `${state.secondName} ${state.firstName}`;
  }),
};
