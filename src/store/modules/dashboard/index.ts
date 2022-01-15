import { nanoid } from 'nanoid';
import { Router } from 'src/router';
import { BaseDashboard, DashboardGroup } from 'src/types';
import { createIdForGroup, isDashboardGroup } from 'src/utils';
import { readonly, reactive, computed } from 'vue';

export type DrawerItem = DashboardGroup | BaseDashboard;

export type State = {
  drawerItems: DrawerItem[];
  activeDashboardId: BaseDashboard['id'] | null;
};

/**
 * @todo remove
 */
const dashboardsMock: State['drawerItems'] = [
  {
    id: nanoid(),
    name: 'Alert board',
  },
  {
    id: createIdForGroup(),
    name: 'Main group',
    dashboards: [
      {
        id: nanoid(),
        name: 'Dashboard with info',
      },
      {
        id: nanoid(),
        name: 'Test board',
      },
    ],
  },
  {
    id: createIdForGroup(),
    name: 'Temp group',
    dashboards: [
      {
        id: nanoid(),
        name: 'Temperatura',
      },
      {
        id: nanoid(),
        name: 'Rasstoanie',
      },
    ],
  },
];

const createState = (): State => ({
  drawerItems: dashboardsMock,
  activeDashboardId: null,
});

const state = reactive<State>(createState());

const mutations = {
  setActiveDashboardId: (value: State['activeDashboardId']): void => {
    state.activeDashboardId = value;
  },
};

export const actions = {
  activateDashboardById: (id: BaseDashboard['id']): void => {
    mutations.setActiveDashboardId(id);
    Router.push({ name: 'Dashboard', params: { id } }).catch(console.error);
  },
};

export const getters = {
  drawerItems: computed(() => readonly(state).drawerItems),
  activeDashboard: computed((): Readonly<DrawerItem> | undefined => {
    for (let index = 0; index < state.drawerItems.length; index++) {
      const element = state.drawerItems[index];

      // If dashboard id
      if (element.id === state.activeDashboardId) {
        return readonly(element);
      }

      // Dashboard group foreach dashboards
      if (isDashboardGroup(element)) {
        for (let j = 0; j < element.dashboards.length; j++) {
          const dashboard = element.dashboards[j];
          if (dashboard.id === state.activeDashboardId) {
            return readonly(dashboard);
          }
        }
      }
    }
    return undefined;
  }),
};