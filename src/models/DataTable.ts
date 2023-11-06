import { MetricFilter } from './MetricFilter'

export type DataTable = {
    id: number,
    type: string,
    name: string,
    description: string,
    ordinal: number,
    visible: boolean,
    sort?: string,
    sortValue?: string,
} & MetricFilter