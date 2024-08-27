<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getProductSales } from '@/api/sales';
import PivotTable from '@/components/table/PivotTable.vue';
import { initTable } from '@/components/table/utils';
import type { RowEntry } from '@/components/table/constants'

const title = ref(import.meta.env.VITE_PROJECT_TITLE);
const author = ref(import.meta.env.VITE_AUTHOR);

const { data, error, isLoading, fetchData } = getProductSales();

const table = ref<{ rows: RowEntry[], head: string[] } | null>(null);

onMounted(async () => {
  await fetchData();
  if (data.value) {
    table.value = initTable(data.value);
  }
});
</script>

<template>
  <header>
    <h1 v-text="title"></h1>
  </header>
  <main>
    <div>
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div
        v-else-if="table"
        class="scrollable-x"
      >
        <pivot-table
          :rows="table.rows"
          :header="table.head"
        ></pivot-table>
      </div>
    </div>
  </main>
  <footer>Made by: {{author}}</footer>
</template>

