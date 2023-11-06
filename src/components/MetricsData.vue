<template>
    <div class="data-content__rows">
        <h5>
            Метрики
        </h5>
        <draggable v-model="metricsData" tag="ul" group="table">
            <template #item="{ element: item }">
                <li class="data-item">
                    {{ item.name }}
                    <img src="../assets/three_dots.svg">
                    <img src="../assets/filter_icon.svg" @click="prompt = true; item.show = true; setActiveId(item.id)">
                    <img src="../assets/arrow.svg" @click="item.show = true, sort = true, setActiveId(item.id)">
                    <q-menu v-model="item.show" auto-close>
                        <q-list style="min-width: 100px">
                            <q-item clickable @click="setType(item, 'SUM')">
                                <q-item-section>Сумма</q-item-section>
                            </q-item>
                            <q-item clickable @click="setType(item, 'COUNT')">
                                <q-item-section>Количество</q-item-section>
                            </q-item>
                            <q-item clickable @click="setType(item, 'COUNT_DISTINCT')">
                                <q-item-section>Кол-во уникальных</q-item-section>
                            </q-item>
                            <q-item clickable @click="setType(item, 'MIN')">
                                <q-item-section>Мин.</q-item-section>
                            </q-item>
                            <q-item clickable @click="setType(item, 'MAX')">
                                <q-item-section>Макс.</q-item-section>
                            </q-item>
                            <q-item clickable @click="setType(item, 'AVG')">
                                <q-item-section>Средн</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </li>
            </template>
        </draggable>
        <FilterModal v-if="prompt" :prompt="prompt" :item="metricsData[activeId]" :removeFilter="removeFilter"
            :addFilter="addFilter" />
        <SortModal v-if="sort" :sort="sort" :item="metricsData[activeId]" :removeSort="removeSort" :setSort="setSort" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useDataTableStore } from '../stores/data-table'
import { useTableStore } from '../stores/table'
import { DataTable } from '../models/DataTable'
import FilterModal from './FilterModal.vue'
import SortModal from './SortModal.vue'

const dataTableStore = useDataTableStore();
const tableStore = useTableStore();

const metricsData = ref(dataTableStore.metricsData)

const activeId = ref(0)

const setActiveId = (index: number): void => {
    let key = metricsData.value.findIndex((metric) => metric.id == index)
    activeId.value = key;
}

const prompt = ref(false)

const sort = ref(false)

export default defineComponent({
    name: 'MetricsData',
    components: { draggable, FilterModal, SortModal },
    props: {
        setPreloader: {
            type: Function,
            required: true
        }
    },
    setup(props) {

        const setStore = (e: ({ typeMetrics?: string } & DataTable)[]) => {
            dataTableStore.metricsData = e;
            props.setPreloader(true)
            tableStore.getTable().then(() => {
                props.setPreloader(false)
            });
        }

        watch(metricsData, (value) => {
            value.forEach(metric => {
                metric.value = '';
                metric.filterType = '';
                metric.invertResult = false;
            })
            setStore(value)
        })

        const setType = (e: { typeMetrics?: string } & DataTable, type: string): void => {
            let index = metricsData.value.findIndex((metric) => metric.id == e.id)
            metricsData.value[index].typeMetrics = type;
            setStore(metricsData.value)
        }

        const removeFilter = (e: { typeMetrics?: string } & DataTable): void => {
            let index = metricsData.value.findIndex((metric) => metric.id == e.id)
            metricsData.value[index].value = '';
            metricsData.value[index].filterType = '';
            metricsData.value[index].invertResult = false;
            setStore(metricsData.value)
            prompt.value = false
        }

        const addFilter = (): void => {
            setStore(metricsData.value)
            prompt.value = false
        }

        const setSort = (): void => {
            setStore(metricsData.value)
            sort.value = false
        }

        const removeSort = (e: { typeMetrics?: string } & DataTable): void => {
            let index = metricsData.value.findIndex((metric) => metric.id == e.id)
            metricsData.value[index].sortValue = '';
            metricsData.value[index].sort = '';
            setStore(metricsData.value)
            sort.value = false
        }

        return {
            metricsData,
            setType,
            removeFilter,
            addFilter,
            setActiveId,
            prompt,
            activeId,
            sort,
            setSort,
            removeSort
        }
    }
})
</script>