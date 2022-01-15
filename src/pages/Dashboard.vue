<template>
  <q-page class="column col-grow q-pa-md">
    <div class="row items-center">
      <div class="text-h5 q-mr-md">{{ activeDashboard?.name }}</div>
      <q-btn outline round icon="edit" color="primary" flat />
      <q-btn outline round icon="delete" color="negative" flat />
    </div>
    <q-separator class="q-my-sm" />
    <div class="row q-gutter-xl">
      <div v-for="index in chartsCounter" :key="index"><BarChart /></div>
      <div v-for="index in chartsCounter" :key="index"><LineChart /></div>
      <div v-for="index in chartsCounter" :key="index">
        <SteppedLineChart />
      </div>
      <q-btn
        icon="add"
        color="grey-6"
        rounded
        size="xl"
        outline
        style="width: 400px; height: 400px"
        @click="chartsCounter++"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { getters } from 'src/store/modules/dashboard';
import BarChart from 'src/components/charts/BarChart.vue';
import LineChart from 'src/components/charts/LineChart.vue';
import SteppedLineChart from 'src/components/charts/SteppedLineChart.vue';
import { ref } from 'vue';

const activeDashboard = getters.activeDashboard;

const chartsCounter = ref(1);
</script>
