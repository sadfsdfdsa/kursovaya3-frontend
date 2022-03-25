import { boot } from 'quasar/wrappers';
import { actions } from 'src/store/modules/auth';

export default boot(async ({ router }) => {
  actions.loadToken();
  try {
    await actions.loginByToken();
    await router.push({ name: 'Main' });
  } catch (e) {
    await router.push({ name: 'Login' });
  }
});
