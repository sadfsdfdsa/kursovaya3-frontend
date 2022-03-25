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
import { getters } from 'src/store/modules/settings';
import { getChartAxisColorsByTheme } from 'src/utils';

const id = nanoid();

onMounted(() => {
  const ctx = (document.getElementById(id) as any).getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
      datasets: [
        {
          label: 'Электроэнергия потрачена',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: getChartAxisColorsByTheme(getters.theme.value),
        },
        x: {
          grid: getChartAxisColorsByTheme(getters.theme.value),
        },
      },
      responsive: false,
      plugins: {
        title: {
          display: false,
          text: 'Bar Chart',
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
