<template>
    <q-dialog v-model="sort" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">Сортировка</div>
            </q-card-section>

            <q-select emit-value map-options option-label="name" option-value="value" filled v-model="item.sort"
                :options="options" label="Направление сортировки" />

            <q-card-section class="q-pt-md">
                <q-input label="Значение, по которому будет идти сортировка" dense v-model="item.sortValue" autofocus />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn @click="removeSort(item)" flat label="Удалить сортировку" v-close-popup />
                <q-btn @click="setSort()" flat label="Добавить сортировку" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'SortModal',
    props: {
        sort: {
            type: Boolean,
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        removeSort: {
            type: Function,
            required: true
        },
        setSort: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        return {
            options: [
                { name: 'По убыванию', value: 'Descending' },
                { name: 'По возрастанию', value: 'Ascending' },
            ],
            sort: ref(props.sort)
        }
    }
})
</script>
