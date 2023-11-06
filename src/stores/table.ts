import { defineStore } from 'pinia'
import { Column } from '../models/Column'
import { DataTable } from '../models/DataTable'
import { MetricFilter } from '../models/MetricFilter'
import { FieldResponse } from '../models/FieldResponse'
import { responseBody } from './responseBody'
import axios from 'axios'
import { useDataTableStore } from './data-table'

type SortMartic = {
    order: string,
    metricId: number,
    tuple?: string[]
}

const fieldResponse = (item: any): FieldResponse[] => {
    let returnFields: FieldResponse[] = [];
    item.forEach((e: any, index: number) => {
        returnFields[index] = {
            fieldId: e.id,
            fieldType: "REPORT_FIELD"
        }
    })
    return returnFields
}

const makeColumn = (name: string, index: number): Column => {
    return {
        name: name,
        required: false,
        label: name,
        field: "key-" + index,
        align: "left",
    }
}

const setMarticFilter = (martics: DataTable[]): (MetricFilter & { rounding: number, metricId: number })[] => {
    let key = 0;
    const filter: (MetricFilter & { rounding: number, metricId: number })[] = [];
    martics.forEach((martic, index) => {
        if (martic.filterType != undefined && martic.filterType != '') {
            filter[key] = {
                filterType: martic.filterType,
                invertResult: martic.invertResult,
                metricId: index,
                rounding: 0,
                values: [
                    (martic.value) ? martic.value : '',
                ]
            }
            key++;
        }
    })
    return filter;
}

const setDefaultFilter = (columns: DataTable[], rows: DataTable[]): (MetricFilter & { rounding: number, canRounding: boolean })[] => {
    let key = 0;
    let filterData = columns.concat(rows);
    const filter: (MetricFilter & { rounding: number, canRounding: boolean })[] = [];
    filterData.forEach((item) => {
        if (item.filterType != undefined && item.filterType != '') {
            filter[key] = {
                filterType: item.filterType,
                invertResult: item.invertResult,
                canRounding: false,
                rounding: 0,
                field: {
                    fieldId: item.id,
                    fieldType: "REPORT_FIELD",
                },
                values: [
                    (item.value) ? item.value : '',
                ]
            }
            key++;
        }
    })
    return filter;
}

const setSort = (martics: DataTable[]): SortMartic[] => {
    const sort: SortMartic[] = [];
    martics.forEach((martic, index) => {
        if (martic.sort != undefined && martic.sort != '') {
            sort[0] = {
                order: martic.sort,
                metricId: index,
                tuple: [martic.sortValue]
            }
        }
    })
    return sort;
}

export const useTableStore = defineStore('table', {
    state: () => ({
        columns: [] as Column[],
        rows: [] as any[],
    }),
    actions: {
        async getTable(): Promise<void> {
            try {

                this.columns.length = 0
                this.rows.length = 0

                const dataTableStore = useDataTableStore();

                responseBody.rowFields = fieldResponse(dataTableStore.rowsData);
                responseBody.columnFields = fieldResponse(dataTableStore.columnData);

                let metricFields: any = [];
                dataTableStore.metricsData.forEach((e, index: number) => {
                    const type = (e.typeMetrics == undefined) ? "SUM" : e.typeMetrics;
                    metricFields[index] = {
                        field: {
                            fieldId: e.id,
                            fieldType: "REPORT_FIELD",
                        },
                        aggregationType: type
                    }
                })
                responseBody.metrics = metricFields
                responseBody.metricFilterGroup.filters = setMarticFilter(dataTableStore.metricsData)

                responseBody.filterGroup.filters = setDefaultFilter(dataTableStore.columnData, dataTableStore.rowsData)

                responseBody.columnSort = setSort(dataTableStore.metricsData)

                const response = await axios.post('http://localhost:8080/api/v1/olap/get-cube', responseBody);

                let rowIndex = 0;
                if (response.data.data.columnValues[0].length == 0) {
                    let index = 0;
                    dataTableStore.rowsData.forEach((e) => {
                        this.columns[index] = makeColumn(e.name, index)
                        index++;
                    })
                    if (response.data.data.metricValues.length > 0) this.columns[index] = makeColumn('', index);
                }
                else {
                    this.columns[0] = makeColumn(dataTableStore.columnData[0].name, 0)
                    let index = 1;
                    for (let key = dataTableStore.rowsData.length - index; key > 0; key--) {
                        this.columns[index] = makeColumn('', index);
                        index++;
                    }
                    response.data.data.columnValues.forEach(element => {
                        this.columns[index] = makeColumn(element[0], index);
                        index++;
                    });

                    dataTableStore.columnData.forEach((element, key) => {
                        if (key == 0) return;

                        let columnItem: any = {};

                        columnItem["key-" + 0] = element.name;

                        let index = 1;

                        response.data.data.columnValues.forEach(element => {
                            columnItem["key-" + index] = element[key];
                            index++;
                        });

                        this.rows[rowIndex] = columnItem
                        rowIndex++
                    })
                }
                if (response.data.data.metricValues.length == 0) {
                    response.data.data.rowValues.forEach((e: any) => {
                        let columnItem: any = {};
                        e.forEach((item: any, key: any) => {
                            columnItem["key-" + key] = item;
                        })
                        this.rows[rowIndex] = columnItem
                        rowIndex++
                    })
                }
                else {
                    let metricIndex = 0;
                    response.data.data.rowValues.forEach((e: any) => {
                        dataTableStore.metricsData.forEach((metric, index) => {
                            let columnItem: any = {};
                            let columnIndex = 0;

                            e.forEach((item: any) => {
                                columnItem["key-" + columnIndex] = item + ' (' + metric.name + ')';
                                columnIndex++;
                            })

                            response.data.data.metricValues[index].values.forEach((item: any) => {
                                columnItem["key-" + columnIndex] = item[metricIndex];
                                columnIndex++;
                            });

                            this.rows[rowIndex] = columnItem
                            rowIndex++
                        })
                        metricIndex++
                    });
                }
            } catch (error) {
                console.error('Failure:', error);
            }
        },
        async getChart(url: string, page: number, items: number): Promise<string> {
            try {
                let datarows: any[] = [];
                const minCount = (page - 1) * items
                const maxCount = page * items

                this.rows.forEach((e, index) => {
                    if ((index + 1 <= minCount) || (index + 1 > maxCount)) return;
                    datarows[index] = e
                })

                datarows = datarows.filter(element => element !== null);

                const response = await axios.post(`http://localhost:8000${url}`, { header: this.columns, rows: datarows });

                return response.data
            } catch (error) {
                console.error('Failure:', error);
                return ''
            }
        }
    }
})
