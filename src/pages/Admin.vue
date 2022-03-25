<template>
  <q-page class="row">
    <div class="column col-grow q-ma-lg">
      <div class="text-h5">Форма создания нового пользователя</div>
      <q-form class="row q-mb-md q-gutter-x-md" @submit="onSubmit">
        <div class="column col-5">
          <q-input
            v-model="secondName"
            label="Фамилия"
            :rules="[(val) => (val && val.length > 0) || 'Введите фамилию']"
          />
          <q-input
            v-model="firstName"
            label="Имя"
            :rules="[(val) => (val && val.length > 0) || 'Введите имя']"
          />
          <q-input
            v-model="patronymic"
            label="Отчество"
            :rules="[(val) => (val && val.length > 0) || 'Введите отчество']"
          />
        </div>
        <div class="column col-5">
          <q-input
            v-model="login"
            label="Логин"
            :rules="[(val) => (val && val.length > 0) || 'Введите логин']"
          />
          <q-input
            v-model="password"
            label="Пароль"
            :rules="[(val) => (val && val.length > 0) || 'Введите пароль']"
          />
          <q-btn
            class="q-mt-sm"
            outline
            color="primary"
            size="lg"
            no-caps
            label="Создать"
            type="submit"
          />
        </div>
      </q-form>
      <q-table
        title="Пользователи"
        :rows="rows"
        :columns="columns"
        row-key="name"
        binary-state-sort
        hide-bottom
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="secondName" :props="props">
              {{ props.row.secondName }}
              <q-popup-edit
                v-slot="scope"
                v-model="props.row.secondName"
                buttons
              >
                <q-input v-model="scope.value" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="firstName" :props="props">
              {{ props.row.firstName }}
              <q-popup-edit
                v-slot="scope"
                v-model="props.row.firstName"
                buttons
              >
                <q-input v-model="scope.value" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="patronymic" :props="props">
              {{ props.row.patronymic }}
              <q-popup-edit
                v-slot="scope"
                v-model="props.row.patronymic"
                buttons
              >
                <q-input v-model="scope.value" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="login" :props="props">
              {{ props.row.login }}
              <q-popup-edit v-slot="scope" v-model="props.row.login" buttons>
                <q-input v-model="scope.value" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="password" :props="props"
              >{{ new Array(props.row.password.length).fill('*').join('') }}
              <q-popup-edit v-slot="scope" v-model="props.row.password" buttons>
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                /> </q-popup-edit
            ></q-td>
            <q-td><q-btn label="X" color="negative" /></q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { actions, User } from 'src/store/modules/user';
import { ref } from 'vue';

const columns = [
  {
    name: 'secondName',
    label: 'Фамилия',
    align: 'left',
    field: 'secondName',
    sortable: true,
  },
  {
    name: 'firstName',
    align: 'left',
    label: 'Имя',
    field: 'firstName',
    sortable: true,
  },
  {
    name: 'patronymic',
    align: 'left',

    label: 'Отчество',
    field: 'patronymic',
    sortable: true,
  },
  {
    name: 'login',
    label: 'Логин',
    align: 'left',
    field: 'login',
    sortable: true,
  },
  {
    name: 'password',
    label: 'Пароль',
    align: 'left',
    field: 'password',
  },
];

const rows = ref<User[]>([
  {
    firstName: 'Artem',
    secondName: 'Shuvaev',
    patronymic: 'Konstantinovich',
    login: 'login_artem',
    password: 'pass',
  },
  {
    firstName: 'Oleg',
    secondName: 'Gorshkov',
    patronymic: 'Vladimirovich',
    login: 'login_oleg',
    password: 'password',
  },
  {
    firstName: 'Vasiliy',
    secondName: 'Novikov',
    patronymic: 'Ivanovich',
    login: 'login_vasya',
    password: 'password123',
  },
]);

const login = ref('');
const password = ref('');

const firstName = ref('');
const secondName = ref('');
const patronymic = ref('');

const $q = useQuasar();

const onSubmit = () => {
  try {
    actions.createUser({
      login: login.value,
      password: password.value,
      firstName: firstName.value,
      secondName: secondName.value,
      patronymic: patronymic.value,
    });
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Ошибка создания пользователя',
      position: 'bottom-right',
    });
  }
};
</script>
