import { ref } from 'vue'

export default function useDbschema() {
    const dbschema = ref(null)
    const tables = ref([])
    const selectedTable = ref(null)
    const tableSchema = ref([])
    const tableData = ref([])
    const loading = ref(false)
    const error = ref(null)

    const getDbschema = async () => {
        loading.value = true
        error.value = null
        
        try {
            const result = await window.api.getDbSchema()
            if (result.success) {
                dbschema.value = result.data
            } else {
                error.value = result.error
            }
        } catch (err) {
            error.value = err.message
            console.error('Failed to get database schema:', err)
        } finally {
            loading.value = false
        }
    }

    const getTableList = async () => {
        try {
            const result = await window.api.getTableList()
            if (result.success) {
                tables.value = result.data
                if (tables.value.length > 0) {
                    await selectTable(tables.value[0].name)
                }
            } else {
                error.value = result.error
            }
        } catch (err) {
            error.value = err.message
            console.error('Failed to get table list:', err)
        }
    }

    const selectTable = async (tableName) => {
        selectedTable.value = tableName
        await Promise.all([
            getTableSchema(tableName),
            getTableData(tableName)
        ])
    }

    const getTableSchema = async (tableName) => {
        try {
            const result = await window.api.getTableSchema(tableName)
            if (result.success) {
                tableSchema.value = result.data
            } else {
                error.value = result.error
            }
        } catch (err) {
            error.value = err.message
            console.error('Failed to get table schema:', err)
        }
    }

    const getTableData = async (tableName, limit = 100) => {
        try {
            const result = await window.api.getTableData(tableName, limit)
            if (result.success) {
                tableData.value = result.data
            } else {
                error.value = result.error
            }
        } catch (err) {
            error.value = err.message
            console.error('Failed to get table data:', err)
        }
    }

    return {
        dbschema,
        tables,
        selectedTable,
        tableSchema,
        tableData,
        loading,
        error,
        getDbschema,
        getTableList,
        selectTable,
        getTableSchema,
        getTableData
    }
}