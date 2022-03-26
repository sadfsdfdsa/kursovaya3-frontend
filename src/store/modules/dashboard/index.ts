import { nanoid } from 'nanoid';
import { api } from 'src/boot/axios';
import { Router } from 'src/router';
import { BaseDashboard, DashboardGroup } from 'src/types';
import { createIdForGroup, isDashboardGroup } from 'src/utils';
import { readonly, reactive, computed, ref } from 'vue';

export type DrawerItem = DashboardGroup | BaseDashboard;

export type State = {
  drawerItems: DrawerItem[];
  activeDashboardId: BaseDashboard['id'] | null;
};

/**
 * @todo remove
 */
const dashboardsMock: State['drawerItems'] = [
  // {
  //   id: nanoid(),
  //   name: 'ALERTS мониторинг',
  //   widgets: [],
  //   request: '',
  // },
  {
    id: createIdForGroup(),
    name: 'Основной мониторинг',
    dashboards: [
      {
        id: nanoid(),
        name: 'Потрачено электроэнергии',
        widgets: [],
        result_id: '14',
        request: `{
          "db_io_parameters": {
            "mode": "rw",
            "result_id": [
              "14"
            ],
             "device_id": [
               "4"
             ],
             "data_source_id": [
               100
             ],
             "time_upload": [
               "2021-11-10_00:00:00+0000",
               "2022-01-10_23:59:59+0000"
             ],
            "limit": 3000
          },
          "analysis_parameters": {
            "analysis": "test",
            "analysis_arguments": {
              "operation": [
                "mul"
              ],
              "value": [
                "10.0"
              ]
            }
          }
         }

         `,
      },
      // {
      //   id: nanoid(),
      //   name: 'Тестовый борд',
      //   widgets: [],
      //   request: '',
      // },
    ],
  },
  // {
  //   id: createIdForGroup(),
  //   name: 'Энергия Компания#1',
  //   dashboards: [
  //     {
  //       id: nanoid(),
  //       name: 'Потрачено',
  //       widgets: [],
  //       request: '',
  //     },
  //     {
  //       id: nanoid(),
  //       name: 'Получено',
  //       widgets: [],
  //       request: '',
  //     },
  //   ],
  // },
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
  setDashboardNameById: (
    id: BaseDashboard['id'],
    name: BaseDashboard['name']
  ): void => {
    state.drawerItems = state.drawerItems.map((item) => {
      if ((item as DashboardGroup).dashboards) {
        const copyItem: DashboardGroup = item as DashboardGroup;
        copyItem.dashboards = copyItem.dashboards.map((board) => {
          if (board.id !== id) return board;
          return {
            ...board,
            name,
          };
        });

        return copyItem;
      }
      if (item.id !== id) return item;
      return {
        ...item,
        name,
      };
    });
  },
  addDashboardToRoot: (
    name: string,
    id: string,
    request: string,
    result_id: string
  ): void => {
    state.drawerItems.push({
      name,
      id,
      widgets: [],
      request,
      result_id,
    });
  },
  addDashboardToGroupById: (
    name: string,
    id: string,
    request: string,
    result_id: string,
    groupId: string
  ): void => {
    state.drawerItems = state.drawerItems.map((item) => {
      if (item.id !== groupId) return item;
      const copy = item as DashboardGroup;
      copy.dashboards = [
        ...copy.dashboards,
        {
          name,
          id,
          widgets: [],
          request,
          result_id,
        },
      ];

      return copy;
    });
  },
  addGroupToRoot: (name: string, id: string): void => {
    state.drawerItems.push({
      id,
      name,
      dashboards: [],
    } as DrawerItem);
  },
  toggleWidgetInDashboard: (id: string, widget: string): void => {
    state.drawerItems = state.drawerItems.map((item) => {
      if (isDashboardGroup(item)) {
        const copy = item as DashboardGroup;
        copy.dashboards = copy.dashboards.map((board) => {
          if (board.id !== id) return board;

          if (board.widgets.includes(widget)) {
            return {
              ...board,
              widgets: board.widgets.filter((name) => name !== widget),
            };
          }

          board.widgets.push(widget);
          return board;
        });
        return copy;
      }

      if (item.id !== id) return item;

      if (item.widgets.includes(widget)) {
        return {
          ...item,
          widgets: item.widgets.filter((name) => name !== widget),
        };
      }

      item.widgets.push(widget);
      return item;
    });
  },
  removeDashboardById: (id: string): void => {
    state.drawerItems = state.drawerItems
      .map((item) => {
        if (isDashboardGroup(item)) {
          const copy = item as DashboardGroup;
          copy.dashboards = copy.dashboards
            .map((board) => {
              if (board.id === id) return undefined;
              return board;
            })
            .filter((i) => i !== undefined) as BaseDashboard[];
          return copy;
        }
        if (item.id === id) return undefined;
        return item;
      })
      .filter((i) => i !== undefined) as DrawerItem[];
  },
  removeDashboardGroupById: (id: string): void => {
    state.drawerItems = state.drawerItems.filter((item) => item.id !== id);
  },
  changeGroupNameById: (id: string, name: string): void => {
    state.drawerItems = state.drawerItems.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        name,
      };
    });
  },
};

type ResultType = { result_id: string; time: string; value: number }[];
export const results = ref<ResultType>([]);

export const actions = {
  activateDashboardById: (id: BaseDashboard['id']): void => {
    mutations.setActiveDashboardId(id);
    Router.push({ name: 'Dashboard', params: { id } }).catch(console.error);

    const dashboard = getters.activeDashboard.value as BaseDashboard;

    api
      .get(`/results/${dashboard.result_id}`)
      .then((res) => {
        results.value = res.data as unknown as ResultType;
      })
      .catch(console.error);
  },
  setDashboardNameById: (
    id: BaseDashboard['id'],
    name: BaseDashboard['name']
  ): void => {
    mutations.setDashboardNameById(id, name);
  },
  addDashboardToRoot: (name: string, request: string): void => {
    const id = nanoid();
    const parsed: unknown = JSON.parse(request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const result_id = (parsed as any).db_io_parameters?.result_id?.[0];
    if (!result_id) throw new Error('wrong request');

    mutations.addDashboardToRoot(name, id, request, result_id);

    api.post('/results', { request }).catch(console.error);
  },
  addDashboardToGroup: (
    name: string,
    request: string,
    groupId: string
  ): void => {
    const id = nanoid();
    const parsed: unknown = JSON.parse(request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const result_id = (parsed as any).db_io_parameters?.result_id?.[0];
    if (!result_id) throw new Error('wrong request');
    api.post('/results', JSON.stringify(request)).catch(console.error);

    mutations.addDashboardToGroupById(name, id, request, result_id, groupId);
  },
  addGroupToRoot: (name: string): void => {
    const id = createIdForGroup();
    mutations.addGroupToRoot(name, id);
  },
  toggleWidgetInDashboard: (id: string, widget: string): void => {
    mutations.toggleWidgetInDashboard(id, widget);
  },
  removeDashboardById: (id: string): void => {
    Router.push({ name: 'Main' })
      .then(() => {
        mutations.removeDashboardById(id);
      })
      .catch(console.error);
  },
  removeDashboardGroupById: (id: string): void => {
    Router.push({ name: 'Main' })
      .then(() => {
        mutations.removeDashboardGroupById(id);
      })
      .catch(console.error);
  },
  changeGroupNameById: (id: string, name: string): void => {
    mutations.changeGroupNameById(id, name);
  },
};

export const getters = {
  drawerItems: computed(() => readonly(state).drawerItems),
  activeDashboard: computed((): Readonly<DrawerItem> | undefined => {
    for (let index = 0; index < state.drawerItems.length; index++) {
      const element = state.drawerItems[index];

      // If dashboard id
      if (element.id === state.activeDashboardId) {
        return readonly(element) as BaseDashboard;
      }

      // Dashboard group foreach dashboards
      if (isDashboardGroup(element)) {
        for (let j = 0; j < element.dashboards.length; j++) {
          const dashboard = element.dashboards[j];
          if (dashboard.id === state.activeDashboardId) {
            return readonly(dashboard) as unknown as DashboardGroup;
          }
        }
      }
    }
    return undefined;
  }),
};
