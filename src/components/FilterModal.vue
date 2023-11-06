<template>
    <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">Фильтр</div>
            </q-card-section>

            <q-select emit-value map-options option-label="name" option-value="value" filled v-model="item.filterType"
                :options="options" label="Тип сравнения" />

            <q-card-section class="q-pt-md">
                <q-input label="Значение" dense v-model="item.value" autofocus />
            </q-card-section>

            <div class="q-pa-md">
                <q-checkbox label="Не" v-model="item.invertResult" />
            </div>

            <q-card-actions align="right" class="text-primary">
                <q-btn @click="removeFilter(item)" flat label="Удалить фильтр" v-close-popup />
                <q-btn @click="addFilter()" flat label="Добавить фильтр" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'FilterModal',
    props: {
        prompt: {
            type: Boolean,
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        removeFilter: {
            type: Function,
            required: true
        },
        addFilter: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        return {
            options: [
                { name: 'Пустой', value: 'EMPTY' },
                { name: 'В списке', value: 'IN_LIST' },
                { name: 'Учитывать Регистр', value: 'CONTAINS_CS' },
                { name: 'Не учитывать регистр', value: 'CONTAINS_CI' },
                { name: 'равно', value: 'EQUALS' },
                { name: 'больше', value: 'GREATER' },
                { name: 'меньше', value: 'LESSER' },
                { name: 'больше или равно', value: 'GREATER_OR_EQUALS' },
                { name: 'меньше или равно', value: 'LESSER_OR_EQUALS' },
                { name: 'между', value: 'BETWEEN' },
                { name: 'заполненный', value: 'BLANK' }
            ],
            prompt: ref(props.prompt)
        }
    }
})
</script>
