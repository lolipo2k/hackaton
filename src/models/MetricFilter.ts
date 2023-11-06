import { FieldResponse } from './FieldResponse'

export interface MetricFilter {
    filterType?: string,
    invertResult?: boolean,
    value?: string,
    values?: string[],
    field?: FieldResponse
}