<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="headerClass">
      <q-toolbar>
        <div class="row items-center q-ml-auto">
          <q-btn
            round
            :text-color="settingsBtnClass"
            icon="dark_mode"
            outline
            flat
            @click="settingsActions.changeTheme"
          />
          <q-btn
            rounded
            :text-color="settingsBtnClass"
            icon="language"
            outline
            flat
            @click="settingsActions.changeLang"
          >
            {{ settingsGetters.invertLang.value }}
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page class="row items-center justify-evenly">
      <div class="column col-grow" style="max-width: 400px">
        <div class="text-h4 q-mb-md text-center">
          {{ $t('login') }} | HSE LAB
        </div>
        <q-form class="q-gutter-y-md" @submit="onSubmit">
          <q-input
            v-model="email"
            :label="$t('email')"
            type="email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('loginInputError')]"
          />
          <q-input
            v-model="password"
            :label="$t('password')"
            type="password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('loginInputError')]"
          />
          <q-btn
            class="row full-width"
            :label="$t('login')"
            type="submit"
            color="primary"
          />
          <q-btn
            :label="$t('forgotPasswordQ')"
            color="primary"
            class="full-width row"
            flat
            @click="onForgotPassword"
          />
        </q-form>
      </div>
    </q-page>
  </q-layout>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { actions } from 'src/store/modules/auth';
import { computed, ref } from 'vue';
import {
  actions as settingsActions,
  getters as settingsGetters,
} from 'src/store/modules/settings';
import { useI18n } from 'vue-i18n';
import { showUnderDevelopmentNotification } from 'src/utils';

const email = ref('');
const password = ref('');

const $q = useQuasar();

const headerClass = computed(() => {
  return settingsGetters.theme.value === 'dark' ? 'bg-dark' : 'bg-white';
});

const settingsBtnClass = computed(() => {
  return settingsGetters.theme.value === 'dark' ? 'white' : 'dark';
});

const i18n = useI18n();

const onForgotPassword = () => showUnderDevelopmentNotification();

const onSubmit = () => {
  try {
    actions.loginByLoginAndPass(email.value, password.value);
  } catch (e) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: i18n.t('loginError'),
      position: 'bottom-right',
    });
  }
};
</script>
