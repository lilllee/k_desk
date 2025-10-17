<template>
    <DashboardLayout :header="headerConfig">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 데이터베이스 정보 -->
        <DashboardCard title="데이터베이스 정보" intent="default" class="lg:col-span-1">
          <div class="space-y-4">
            <div v-if="loading" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-600">로딩 중...</p>
            </div>
            <div v-else-if="error" class="text-red-600 bg-red-50 p-3 rounded-md">
              <p class="font-medium">오류 발생:</p>
              <p class="text-sm">{{ error }}</p>
            </div>
            <div v-else class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">스키마 버전:</span>
                <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{{ dbschema }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">테이블 수:</span>
                <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{{ tables.length }}</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <!-- 테이블 목록 -->
        <DashboardCard title="테이블 목록" intent="default" class="lg:col-span-2">
          <div class="space-y-4">
            <div v-if="tables.length === 0" class="text-center py-8 text-gray-500">
              테이블이 없습니다.
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                v-for="table in tables"
                :key="table.name"
                @click="selectTable(table.name)"
                :class="[
                  'p-3 text-left rounded-lg border transition-colors',
                  selectedTable === table.name
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                ]"
              >
                <div class="font-medium text-sm">{{ table.name }}</div>
                <div class="text-xs text-gray-500 mt-1">테이블</div>
              </button>
            </div>
          </div>
        </DashboardCard>

        <!-- 선택된 테이블 스키마 -->
        <DashboardCard v-if="selectedTable" :title="`${selectedTable} 스키마`" intent="default" class="lg:col-span-1">
          <div class="space-y-2">
            <div v-if="tableSchema.length === 0" class="text-center py-4 text-gray-500">
              스키마 정보가 없습니다.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="column in tableSchema"
                :key="column.cid"
                class="p-2 bg-gray-50 rounded text-sm"
              >
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ column.name }}</span>
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {{ column.type }}
                  </span>
                </div>
                <div class="flex gap-2 mt-1">
                  <span v-if="column.pk" class="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">PK</span>
                  <span v-if="column.notnull" class="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">NOT NULL</span>
                  <span v-if="column.dflt_value" class="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">DEFAULT</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <!-- 선택된 테이블 데이터 -->
        <DashboardCard v-if="selectedTable" :title="`${selectedTable} 데이터`" intent="default" class="lg:col-span-2">
          <div class="space-y-4">
            <div v-if="tableData.length === 0" class="text-center py-8 text-gray-500">
              데이터가 없습니다.
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      v-for="column in tableSchema"
                      :key="column.cid"
                      class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ column.name }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in tableData" :key="index" class="hover:bg-gray-50">
                    <td
                      v-for="column in tableSchema"
                      :key="column.cid"
                      class="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                    >
                      <span v-if="row[column.name] === null" class="text-gray-400 italic">null</span>
                      <span v-else class="font-mono">{{ row[column.name] }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="tableData.length > 0" class="text-xs text-gray-500 text-center">
              최대 100개 행 표시
            </div>
          </div>
        </DashboardCard>
      </div>
   </DashboardLayout>
</template>

<script setup>
import dbschemaLogic from '../services/dbschema.js'
import DashboardLayout from '../components/ui/DashboardLayout.vue'
import DashboardCard from '../components/ui/DashboardCard.vue'
import { Database } from 'lucide-vue-next'
import { onMounted } from 'vue'

const headerConfig = {
  title: '데이터베이스 스키마',
  description: '데이터베이스 테이블 구조 및 데이터 확인',
  icon: Database
}

// 서비스 로직을 컴포넌트에 연결
const {
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
  // getTableSchema,
  // getTableData
} = dbschemaLogic()

onMounted(() => {
  getDbschema()
  getTableList()
})
</script>
