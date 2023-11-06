<template>
    <div class="data-content__rows">
        <h5>
            Строки
        </h5>
        <draggable v-model="rowsData" tag="ul" group="table">
            <template #item="{ element: item }">
                <li class="data-item">
                    {{ item.name }}
                    <img src="../assets/filter_icon.svg" @click="prompt = true; setActiveId(item.id)">
                </li>
            </template>
        </draggable>
        <FilterModal v-if="prompt" :prompt="prompt" :item="rowsData[activeId]" :removeFilter="removeFilter"
            :addFilter="addFilter" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useDataTableStore } from '../stores/data-table'
import { useTableStore } from '../stores/table'
import { DataTable } from '../models/DataTable'
import FilterModal from './FilterModal.vue'

const dataTableStore = useDataTableStore();
const tableStore = useTableStore();

const rowsData = ref(dataTableStore.rowsData);

const activeId = ref(0)

const setActiveId = (index: number): void => {
    let key = rowsData.value.findIndex((row) => row.id == index)
    activeId.value = key;
}

const prompt = ref(false)

export default defineComponent({
    name: 'RowsData',
    components: { draggable, FilterModal },
    props: {
        setPreloader: {
            type: Function,
            required: true
        }
    },
    setup(props) {

        const setStore = (e: DataTable[]) => {
            dataTableStore.rowsData = e;
            props.setPreloader(true)
            tableStore.getTable().then(() => {
                props.setPreloader(false)
            });
        }

        watch(rowsData, (value) => {
            setStore(value)
        })

        const removeFilter = (e: DataTable): void => {
            let index = rowsData.value.findIndex((row) => row.id == e.id)
            rowsData.value[index].value = '';
            rowsData.value[index].filterType = '';
            rowsData.value[index].invertResult = false;
            setStore(rowsData.value)
            prompt.value = false
        }

        const addFilter = (): void => {
            setStore(rowsData.value)
            prompt.value = false
        }
        return {
            rowsData,
            activeId,
            prompt,
            addFilter,
            removeFilter,
            setActiveId
        }
    }
})
</script>