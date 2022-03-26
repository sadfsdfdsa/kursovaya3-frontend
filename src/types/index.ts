export type DashboardGroup = {
  id: `group/${UUID}`;
  name: string;
  dashboards: BaseDashboard[];
};

export type UUID = string;

export type BaseDashboard = {
  id: UUID; // uuid
  name: string;
  widgets: string[]
  request: string
  result_id: string
};

export type Dashboard = BaseDashboard & {
  add: string; // TODO
};
