import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './store'

Vue.use(VueCompositionApi);

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
