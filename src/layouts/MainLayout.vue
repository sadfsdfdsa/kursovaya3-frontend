<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.name !== 'Admin'"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-btn
          v-else
          flat
          dense
          round
          icon="arrow_back"
          @click="$router.go(-1)"
        />

        <q-toolbar-title>HSE | LAB</q-toolbar-title>

        <div class="row items-center">
          <div class="rounded-borders q-pa-xs text-h6">
            {{ userGetters.username.value }}
          </div>

          <q-btn
            v-if="authGetters.isAdmin.value"
            rounded
            text-color="white"
            icon="admin_panel_settings"
            outline
            flat
            class="q-mx-md"
            @click="$router.push({ name: 'Admin' })"
          >
            {{ $t('adminPanel') }}
          </q-btn>

          <q-btn
            round
            :text-color="
              settingsGetters.theme.value === 'dark' ? 'white' : 'dark'
            "
            icon="dark_mode"
            outline
            flat
            @click="settingsActions.changeTheme"
          />
          <q-btn
            rounded
            text-color="white"
            icon="language"
            outline
            flat
            @click="settingsActions.changeLang"
          >
            {{ settingsGetters.invertLang.value }}
          </q-btn>
          <q-btn
            round
            color="red-5"
            icon="logout"
            outline
            flat
            @click="authActions.logout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.name !== 'Admin'"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          class="text-subtitle1 row justify-between items-center"
          header
        >
          {{ $t('drawerHeader') }}
          <q-btn outline flat round size="md" icon="home" @click="goHome" />
        </q-item-label>
        <q-tree
          v-model:selected="selected"
          :nodes="drawerItems"
          node-key="id"
          children-key="dashboards"
          label-key="name"
          no-nodes-label="There is no dashboards already created"
          default-expand-all
          no-connectors
          selected-color="primary"
          @update:selected="onSelectNode"
        >
          <template #default-header="prop">
            <div class="row items-center justify-between col-grow">
              <div
                class="text-subtitle1"
                :class="{
                  'text-primary text-weight-bold': prop.node.dashboards,
                }"
              >
                {{ prop.node.name }}
              </div>
              <q-btn
                v-if="prop.node.dashboards"
                outline
                flat
                round
                icon="more_horiz"
                size="xs"
                ><q-menu auto-close>
                  <q-list style="min-width: 100px">
                    <q-item
                      dense
                      clickable
                      @click="showUnderDevelopmentNotification"
                    >
                      <q-item-section side>
                        <q-icon color="primary" name="add" size="xs" />
                      </q-item-section>
                      <q-item-section> {{ $t('addShort') }}</q-item-section>
                    </q-item>
                    <q-item
                      dense
                      clickable
                      @click="showUnderDevelopmentNotification"
                    >
                      <q-item-section side>
                        <q-icon color="secondary" name="edit" size="xs" />
                      </q-item-section>
                      <q-item-section>{{ $t('editName') }}</q-item-section>
                    </q-item>
                    <q-item
                      dense
                      clickable
                      @click="showUnderDevelopmentNotification"
                    >
                      <q-item-section side>
                        <q-icon color="negative" name="delete" size="xs" />
                      </q-item-section>
                      <q-item-section>{{ $t('delete') }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </template>
        </q-tree>
        <q-separator class="q-my-sm" />
        <q-item dense>
          <q-item-section>
            <q-btn
              outline
              color="primary"
              flat
              size="md"
              @click="showUnderDevelopmentNotification"
            >
              {{ $t('addDashboardGroup') }}
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>
            <q-btn
              outline
              flat
              size="md"
              @click="showUnderDevelopmentNotification"
            >
              {{ $t('addDashboard') }}
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  actions as settingsActions,
  getters as settingsGetters,
} from 'src/store/modules/settings';
import {
  actions as authActions,
  getters as authGetters,
} from 'src/store/modules/auth';
import { getters as userGetters } from 'src/store/modules/user';
import {
  getters as dashboardGetters,
  actions as dashboardActions,
} from 'src/store/modules/dashboard';
import { Dashboard } from 'src/types';
import { showUnderDevelopmentNotification } from 'src/utils';
import { Router } from 'src/router';

const leftDrawerOpen = ref(false);

const drawerItems = [...dashboardGetters.drawerItems.value];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const selected = ref(null);

const goHome = () => {
  Router.push({ name: 'Main' }).catch(console.error);
  selected.value = null;
};

const onSelectNode = (target: Dashboard['id'] | null): void => {
  if (target === null || target.startsWith('group/')) return;
  dashboardActions.activateDashboardById(target);
};
</script>
