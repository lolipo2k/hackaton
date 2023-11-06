<template>
    <div class="data-list--column">
        <h5>
            Столбцы
        </h5>
        <draggable v-model="columnData" tag="ul" group="table">
            <template #item="{ element: item }">
                <li class="data-item">
                    {{ item.name }}
                    <img src="../assets/filter_icon.svg" @click="prompt = true; setActiveId(item.id)">
                </li>
            </template>
        </draggable>
        <FilterModal v-if="prompt" :prompt="prompt" :item="columnData[activeId]" :removeFilter="removeFilter"
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

const columnData = ref(dataTableStore.columnData);

const activeId = ref(0)

const setActiveId = (index: number): void => {
    let key = columnData.value.findIndex((column) => column.id == index)
    activeId.value = key;
}

const prompt = ref(false)

export default defineComponent({
    name: 'ColumnData',
    components: { draggable, FilterModal },
    props: {
        setPreloader: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const setStore = (e: DataTable[]) => {
            dataTableStore.columnData = e;
            props.setPreloader(true)
            tableStore.getTable().then(() => {
                props.setPreloader(false)
            });
        }

        const removeFilter = (e: DataTable): void => {
            let index = columnData.value.findIndex((column) => column.id == e.id)
            columnData.value[index].value = '';
            columnData.value[index].filterType = '';
            columnData.value[index].invertResult = false;
            setStore(columnData.value)
            prompt.value = false
        }

        const addFilter = (): void => {
            setStore(columnData.value)
            prompt.value = false
        }

        watch(columnData, (value) => {
            setStore(value)
        })
        return {
            columnData,
            activeId,
            prompt,
            addFilter,
            removeFilter,
            setActiveId
        }
    }
})
</script>