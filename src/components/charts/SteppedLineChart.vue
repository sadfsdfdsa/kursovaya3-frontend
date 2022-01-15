<template>
  <canvas :id="id" width="400" height="400"></canvas>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { onMounted, watchEffect } from 'vue';
import Chart from 'chart.js/auto';
import { nanoid } from 'nanoid';
import { getChartAxisColorsByTheme } from 'src/utils';
import { getters } from 'src/store/modules/settings';

const id = nanoid();

onMounted(() => {
  const ctx = (document.getElementById(id) as any).getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [12, 19, 3, 5, 2, 3].map((_, i) => i),
      datasets: [
        {
          label: 'Blue',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          stepped: true,
          // fill: true,
        },
        {
          label: 'Red',
          data: [12, 19, 3, 5, 2, 3].reverse(),
          borderWidth: 1,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          stepped: true,
          // fill: true,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
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
          display: true,
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
