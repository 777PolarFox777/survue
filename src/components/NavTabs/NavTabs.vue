<template>
  <v-tabs :value="activeTab" @change="onTabChange">
    <v-tab>Edit</v-tab>
    <v-tab>Preview</v-tab>
  </v-tabs>
</template>

<script>
import { computed } from "@vue/composition-api";
import store from "@/store";

export default {
  name: "NavTabs",
  setup() {
    const activeTab = computed(() => store.navTabs.activeTab);

    const onTabChange = (payload) => {
      console.log('payload', payload);
      store.navTabs.setActiveTab(payload);
    }

    return {
      activeTab,
      onTabChange,
    }
  }
}
</script>

<style scoped>

</style>