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
                      @click="addDashboardToGroup(prop.node.id)"
                    >
                      <q-item-section side>
                        <q-icon color="primary" name="add" size="xs" />
                      </q-item-section>
                      <q-item-section> {{ $t('addShort') }}</q-item-section>
                    </q-item>
                    <q-item
                      dense
                      clickable
                      @click="
                        editNameDashboardGroupById(prop.node.id, prop.node.name)
                      "
                    >
                      <q-item-section side>
                        <q-icon color="secondary" name="edit" size="xs" />
                      </q-item-section>
                      <q-item-section>{{ $t('editName') }}</q-item-section>
                    </q-item>
                    <q-item
                      dense
                      clickable
                      @click="removeDashboardGroupById(prop.node.id)"
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
              @click="groupModal = true"
            >
              {{ $t('addDashboardGroup') }}
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>
            <q-btn outline flat size="md" @click="dashboardModal = true">
              {{ $t('addDashboard') }}
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="dashboardModal" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Название дашборда</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="dashboardName"
            label="Название дашборда"
            dense
            autofocus
          />
          <q-input
            v-model="dashboardRequest"
            label="Запрос на сервер аналитики в формате JSON"
            class="q-mt-md"
            filled
            type="textarea"
            dense
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Отменить" />
          <q-btn
            v-close-popup
            flat
            label="Создать дашбоард"
            @click="addDashboard"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="groupModal" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Название группы</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="groupName"
            label="Название группы"
            dense
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Отменить" />
          <q-btn
            v-close-popup
            flat
            :label="activeGroupId ? 'Сохранить' : 'Создать группу'"
            @click="activeGroupId ? saveGroup() : addGroup()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
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

const drawerItems = computed(() => [...dashboardGetters.drawerItems.value]);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const selected = ref(null);

const activeGroupId = ref('');

const groupModal = ref(false);
const groupName = ref('');

const dashboardModal = ref(false);
const dashboardName = ref('');
const dashboardRequest = ref('');

const goHome = () => {
  Router.push({ name: 'Main' }).catch(console.error);
  selected.value = null;
};

const onSelectNode = (target: Dashboard['id'] | null): void => {
  if (target === null || target.startsWith('group/')) return;
  dashboardActions.activateDashboardById(target);
};

const addGroup = (): void => {
  dashboardActions.addGroupToRoot(groupName.value);
  groupName.value = '';
};

const addDashboard = (): void => {
  if (activeGroupId.value) {
    dashboardActions.addDashboardToGroup(
      dashboardName.value,
      dashboardRequest.value,
      activeGroupId.value
    );
  } else {
    dashboardActions.addDashboardToRoot(
      dashboardName.value,
      dashboardRequest.value
    );
  }
  dashboardName.value = '';
  dashboardRequest.value = '';
};

const removeDashboardGroupById = (id: string): void => {
  dashboardActions.removeDashboardGroupById(id);
};

const editNameDashboardGroupById = (id: string, name: string): void => {
  activeGroupId.value = id;
  groupName.value = name;
  groupModal.value = true;
};

const addDashboardToGroup = (id: string): void => {
  activeGroupId.value = id;
  dashboardModal.value = true;
};

const saveGroup = (): void => {
  dashboardActions.changeGroupNameById(activeGroupId.value, groupName.value);
  groupName.value = '';
};
</script>
