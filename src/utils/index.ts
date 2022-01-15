import { nanoid } from 'nanoid';
import { Notify } from 'quasar';
import { i18n } from 'src/i18n/instance';
import { BaseDashboard, DashboardGroup } from 'src/types';

export const isDashboard = (
  item: DashboardGroup | BaseDashboard
): item is BaseDashboard => {
  return !(item as DashboardGroup).dashboards;
};

export const isDashboardGroup = (
  item: DashboardGroup | BaseDashboard
): item is DashboardGroup => {
  return !!(item as DashboardGroup).dashboards;
};

export const createIdForGroup = (): DashboardGroup['id'] => {
  return `group/${nanoid()}`;
};

export const getChartAxisColorsByTheme = (
  theme: 'light' | 'dark'
): { color: string; borderColor: string } | undefined => {
  if (theme === 'light') return undefined;

  return {
    color: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  };
};

export const showUnderDevelopmentNotification = () => {
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: i18n.global.t('sectionUnderDevelopment'),
    position: 'bottom-right',
  });
};
