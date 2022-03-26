<template>
  <div class="chartWrapper">
    <div class="chartAreaWrapper">
      <canvas :id="id" height="400" width="7000"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { onMounted, watchEffect, defineProps } from 'vue';
import Chart from 'chart.js/auto';
import { nanoid } from 'nanoid';
import { getChartAxisColorsByTheme } from 'src/utils';
import { getters } from 'src/store/modules/settings';

const id = nanoid();

type Results = { result_id: string; time: string; value: number }[];
const props = defineProps<{ results: Results }>();

onMounted(() => {
  const ctx = (document.getElementById(id) as any).getContext('2d');

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.results.map((item) =>
        new Date(item.time).toLocaleDateString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      ),
      datasets: [
        {
          label: 'Значение',
          data: props.results.map((item) => item.value),
          borderWidth: 1,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          stepped: true,
          // fill: true,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        y: {
          // beginAtZero: true,
          grid: getChartAxisColorsByTheme(getters.theme.value),
        },
        x: {
          grid: getChartAxisColorsByTheme(getters.theme.value),
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Stepped Line Chart',
        },
      },
    },
  });

  watchEffect(() => {
    myChart.options.scales = {
      y: {
        beginAtZero: true,
        grid: getChartAxisColorsByTheme(getters.theme.value),
      },
      x: {
        grid: getChartAxisColorsByTheme(getters.theme.value),
      },
    };
    myChart.update();
  });
});
</script>

<style scoped>
.chartWrapper {
  position: relative;
}

.chartWrapper > canvas {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

.chartAreaWrapper {
  width: 600px;
  overflow-x: scroll;
}
</style>
