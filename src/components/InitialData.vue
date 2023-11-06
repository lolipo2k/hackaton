<template>
    <div class="data-list--column">
        <h5>
            Исходные данные
        </h5>
        <draggable v-model="initData" tag="ul" group="table">
            <template #item="{ element: item }">
                <li class="data-item">{{ item.name }}</li>
            </template>
        </draggable>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { DataTable } from '../models/DataTable';
import { useDataTableStore } from '../stores/data-table'

export default defineComponent({
    name: 'InitialData',
    components: { draggable },
    setup() {

        const dataTableStore = useDataTableStore();

        const initData = ref<DataTable[]>([])

        dataTableStore.getTableData().then(() => {
            initData.value = dataTableStore.initData;
        });


        return {
            initData
        }
    }
})
</script>