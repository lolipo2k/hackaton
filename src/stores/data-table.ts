import { defineStore } from 'pinia'
import { DataTable } from '../models/DataTable';
import axios from 'axios'

export const useDataTableStore = defineStore('data-table', {
  state: () => ({
    columnData: [] as DataTable[],
    rowsData: [] as DataTable[],
    metricsData: [] as ({ typeMetrics?: string } & DataTable)[],
    initData: [] as DataTable[],
  }),
  actions: {
    async getTableData(): Promise<void> {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/report-job/get-metadata', {});
        this.initData = response.data.data.fields;
      } catch (error) {
        console.error('Failure:', error);
      }
    }
  }
})
