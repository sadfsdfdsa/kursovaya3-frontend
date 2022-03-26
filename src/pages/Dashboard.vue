<template>
  <q-page class="column col-grow q-pa-md">
    <div class="row items-center">
      <div v-if="!editName" class="text-h5 q-mr-md">
        {{ activeDashboard?.name }}
      </div>
      <q-input v-else v-model="localName" class="text-h5 q-mr-md" />
      <q-btn
        outline
        round
        icon="edit"
        color="primary"
        flat
        @click="onPressEdit"
      />
      <q-btn
        outline
        round
        icon="delete"
        color="negative"
        flat
        @click="removeDashboard"
      />
      <q-btn
        outline
        rount
        color="primary"
        flat
        :label="$t('check_request')"
        @click="showRequestModal = true"
      />
    </div>
    <q-separator class="q-my-sm" />
    <div
      v-if="results.length"
      :key="activeDashboard.id"
      class="row q-gutter-xl"
    >
      <div v-for="widget in activeDashboard.widgets" :key="widget">
        <component v-bind="{ results }" :is="widgets[widget]"></component>
      </div>
      <q-btn
        icon="add"
        color="grey-6"
        rounded
        size="xl"
        outline
        style="width: 400px; height: 400px"
        @click="showModal = true"
      />
    </div>
    <div v-else class="row items-center q-mt-auto q-mb-auto justify-center">
      <q-spinner-dots size="100px" color="primary" />
    </div>
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Выберите графики</div>
        </q-card-section>

        <q-card-section class="q-pt-none column">
          <q-checkbox
            :model-value="activeDashboard.widgets.includes('bar')"
            label="Столбчатая диаграмма"
            @update:model-value="toggleWidgetInDashboard('bar')"
          />
          <q-checkbox
            :model-value="activeDashboard.widgets.includes('line')"
            label="Линейный граф"
            @update:model-value="toggleWidgetInDashboard('line')"
          />
          <q-checkbox
            :model-value="activeDashboard.widgets.includes('stepped')"
            label="Линейный граф по шагам"
            @update:model-value="toggleWidgetInDashboard('stepped')"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup outline flat label="Закрыть" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showRequestModal">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Запрос дашборда</div>
        </q-card-section>

        <q-card-section class="q-pt-none column">
          {{ activeDashboard.request }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup outline flat label="Закрыть" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { actions, getters, results } from 'src/store/modules/dashboard';
import BarChart from 'src/components/charts/BarChart.vue';
import LineChart from 'src/components/charts/LineChart.vue';
import SteppedLineChart from 'src/components/charts/SteppedLineChart.vue';
import { ComputedRef, ref } from 'vue';
import { BaseDashboard } from 'src/types';

const activeDashboard = getters.activeDashboard as ComputedRef<BaseDashboard>;

const showModal = ref(false);
const showRequestModal = ref(false);

const editName = ref(false);

const localName = ref(activeDashboard.value?.name ?? '');

const onPressEdit = () => {
  if (editName.value) {
    if (!activeDashboard.value?.id) return;
    actions.setDashboardNameById(activeDashboard.value.id, localName.value);
  }
  editName.value = !editName.value;
};

const toggleWidgetInDashboard = (name: string) => {
  actions.toggleWidgetInDashboard(activeDashboard.value.id, name);
};

const removeDashboard = () => {
  actions.removeDashboardById(activeDashboard.value.id);
};

const widgets = {
  bar: BarChart,
  line: LineChart,
  stepped: SteppedLineChart,
};
</script>
