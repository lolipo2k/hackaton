<template>
    <div class="q-pa-xl">
        <InitialData />
        <ColumnData :setPreloader="setPreloader" />
        <div class="data-content">
            <RowsData :setPreloader="setPreloader" />
            <MetricsData :setPreloader="setPreloader" />
            <q-table class="my-sticky-column-table" flat bordered :rows="rows" virtual-scroll :columns="columns"
                row-key="name" :separator="separator" v-model:pagination="pagination" />
        </div>
        <q-btn-dropdown :style="'background: #50774F; color: #F6F6F6; margin: 40px 0 0 auto; display: block;'"
            label="Построить график">
            <q-list>
                <q-item clickable v-close-popup @click="barClick('line')">
                    <q-item-section>
                        <q-item-label>Line chart</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="barClick('bar')">
                    <q-item-section>
                        <q-item-label>Bar chart</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown>
        <div class="chart-display" v-html="chart"></div>
    </div>
    <div class="preloader" v-if="preloader">
        <div class="loader"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import InitialData from 'components/InitialData.vue'
import ColumnData from 'components/ColumnData.vue'
import RowsData from 'components/RowsData.vue'
import MetricsData from 'components/MetricsData.vue'
import { useTableStore } from '../stores/table'

const tableStore = useTableStore();

const columns = ref(tableStore.columns)

const rows = ref(tableStore.rows)

const pagination = ref({
    page: 1,
    rowsPerPage: 5
})

const chart = ref('')

const barClick = (type: string): void => {
    const url = (type == 'line') ? '/api/linePlot' : '/api/barChart'
    setPreloader(true)
    tableStore.getChart(url, pagination.value.page, pagination.value.rowsPerPage).then((e) => {
        chart.value = e
        setPreloader(false)
    })
}

const preloader = ref(false)

const setPreloader = (value: boolean): void => preloader.value = value

export default defineComponent({
    name: 'PivotTable',
    components: { InitialData, ColumnData, RowsData, MetricsData },
    setup() {
        return {
            separator: 'cell',
            columns,
            rows,
            barClick,
            pagination,
            chart,
            preloader,
            setPreloader
        }
    }
})
</script>

