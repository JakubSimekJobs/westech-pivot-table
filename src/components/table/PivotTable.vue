<template>
  <table class="table">
    <thead class="table__head">
    <tr class="table__row">
      <th class="table__col table__leading-col"></th>
      <th
        v-for="(colName, colIndex) in header"
        :key="`head-col-${colIndex}`"
        class="table__col"
      >
        <div
          class="table__cell"
        >
          <button
            class="btn"
            role="button"
            :title="sortBy.order"
            @click="sortData(colName)"
          >
            {{ colName }}
          </button>
        </div>
      </th>
    </tr>
    </thead>
    <tbody class="table__body">
    <template
      v-for="(row, rowIndex) in localData"
      :key="`row-${rowIndex}`"
    >
      <tr class="table__row">
        <td class="table__col table__leading-col">
          <div class="table__cell">
            <button
              class="btn"
              role="button"
              :title="row.open ? 'Hide detail' : 'Show detail'"
              @click="toggleRowDetail(row)"
            >
              {{ row.name }}
            </button>
          </div>
        </td>
        <td
          v-for="(col, colName) in Object.keys(row.cols)"
          :key="`col-${colName}`"
          class="table__col"
        >
          <div
            class="table__cell"
            v-text="row.cols[col]"
          ></div>
        </td>
      </tr>
      <template v-if="row.open">
        <tr
          v-for="(detail, detailIndex) in row.detail"
          :key="`detail-${detailIndex}`"
          class="table__row"
        >
          <td class="table__col table__leading-col">
            <div
              class="table__cell pl-5"
              v-text="detail.name"
            ></div>
          </td>
          <td
            v-for="(detailCol, detailColName) in Object.keys(detail.cols)"
            :key="`detail-col-${detailColName}`"
            class="table__col"
          >
            <div
              class="table__cell"
              v-text="detail.cols[detailCol]"
            ></div>
          </td>
        </tr>
      </template>
    </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { RowEntry } from '@/components/table/constants';
import { onMounted, type Ref, ref } from 'vue'

interface Props {
  rows: RowEntry[];
  header: string[];
}

const props = defineProps<Props>();

/* base block start */
const localData: Ref<RowEntry[]> = ref(null);

onMounted(() => {
  initData(props.rows);
});

function initData(data: RowEntry[]) {
  const openStates = localData.value?.reduce((acc, row) => {
    acc[row.name] = row.open;
    return acc;
  }, {} as Record<string, boolean>);

  const copiedData = JSON.parse(JSON.stringify(data));

  if (openStates) {
    copiedData.forEach((row) => {
      if (openStates[row.name]) {
        row.open = openStates[row.name];
      }
    });
  }

  localData.value = copiedData;
}

/* base block end */
/* show detail block start */
function toggleRowDetail(row: RowEntry) {
  row.open = !row.open;
}
/* show detail block end */
/* sorting block start */
const sortOrder = {
  desc: 'desc',
  asc: 'asc',
  default: 'default',
};

const sortBy = ref({
  colName: '',
  order: sortOrder.default,
})

function sortData(colName: string) {
  if (!sortBy.value.colName || sortBy.value.colName !== colName) {
    sortBy.value.colName = colName;
    sortBy.value.order = sortOrder.desc;
  } else if (sortBy.value.colName === colName && sortBy.value.order === sortOrder.desc) {
    sortBy.value.order = sortOrder.asc;
  } else if (sortBy.value.colName === colName && sortBy.value.order === sortOrder.asc) {
    sortBy.value.colName = '';
    sortBy.value.order = sortOrder.default;
    initData(props.rows);
    return;
  }

  if (sortBy.value.colName && sortBy.value.order) {
    localData.value = sortTable(localData.value, sortBy.value.colName, sortBy.value.order);
  }
}

function sortTable(
  data: RowEntry[],
  column: string,
  order: sortOrder
): RowEntry[] {
  const compare = (a: number, b: number): number => {
    if (order === sortOrder.asc) {
      return a - b;
    } else {
      return b - a;
    }
  };

  // rows
  data.sort((a, b) => {
    const aValue = a.cols[column] || 0;
    const bValue = b.cols[column] || 0;
    return compare(aValue, bValue);
  });

  // rows detail
  data.forEach(row => {
    row.detail.sort((a, b) => {
      const aValue = a.cols[column] || 0;
      const bValue = b.cols[column] || 0;
      return compare(aValue, bValue);
    });
  });

  return data;
}
/* sorting block end */
</script>
