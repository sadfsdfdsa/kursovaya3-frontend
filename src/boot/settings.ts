import { boot } from 'quasar/wrappers';
import { actions } from 'src/store/modules/settings';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default boot(() => {
  actions.loadSettingsFromLocalStorage();
});
