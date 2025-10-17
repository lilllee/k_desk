<template>
  <DashboardLayout :header="headerConfig">
    <DashboardCard title="회원 관리" intent="default">
      <!-- 기존 회원 관리 로직을 여기에 -->
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-accent rounded-lg">
          <div>
            <h3 class="font-medium">김철수</h3>
            <p class="text-sm text-muted-foreground">kim@example.com</p>
          </div>
          <Badge variant="success">활성</Badge>
        </div>
        <!-- 더 많은 회원 항목들... -->
      </div>
    </DashboardCard>
  </DashboardLayout>
</template>

<script setup>
import { Users } from 'lucide-vue-next' 
import DashboardLayout from '../components/ui/DashboardLayout.vue'
import DashboardCard from '../components/ui/DashboardCard.vue'
import Badge from '../components/ui/Badge.vue'

const headerConfig = {
  title: '회원 관리',
  description: '등록된 회원 목록',
  icon: Users
}
</script>