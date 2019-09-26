import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from '/components/App.vue';

Vue.use(VueCompositionApi);

new Vue({
  el: '#app',
  render: h => h(App),
});
