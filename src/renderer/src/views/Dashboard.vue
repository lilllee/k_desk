<template>
  <DashboardLayout :header="headerConfig">
    <!-- 통계 카드들 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <DashboardStat
        label="총 회원 수"
        :value="userCount"
        description="현재 등록된 회원 수"
        :icon="UsersIcon"
        intent="positive"
        direction="up"
        tag="LIVE"
      />
      
      <DashboardStat
        label="활성 패스"
        :value="activePassCount"
        description="현재 사용 중인 패스"
        :icon="CreditCardIcon"
        intent="positive"
        direction="up"
      />
      
      <DashboardStat
        label="좌석 사용률"
        :value="seatUsageRate"
        description="현재 좌석 점유율"
        :icon="MonitorIcon"
        intent="neutral"
        direction="down"
      />
    </div>

    <!-- 메인 콘텐츠 그리드 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 좌석 현황 -->
      <DashboardCard title="좌석 현황" intent="success">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">사용 가능</span>
            <span class="font-display text-2xl text-success">{{ userCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">사용 중</span>
            <span class="font-display text-2xl text-destructive">{{ activePassCount }}</span>
          </div>
        </div>
      </DashboardCard>

      <!-- 최근 활동 -->
      <DashboardCard title="최근 활동" intent="default">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <Bullet variant="success" />
            <span class="text-sm">새로운 회원 가입</span>
            <span class="text-xs text-muted-foreground ml-auto">2분 전</span>
          </div>
          <div class="flex items-center gap-3">
            <Bullet variant="warning" />
            <span class="text-sm">좌석 예약</span>
            <span class="text-xs text-muted-foreground ml-auto">5분 전</span>
          </div>
        </div>
      </DashboardCard>
    </div>
  </DashboardLayout>
</template>

<script>
import User from '../services/user.js'

export default User
</script>

<script setup>
import { Users, CreditCard, Monitor } from 'lucide-vue-next'
import DashboardLayout from '../components/ui/DashboardLayout.vue'
import DashboardStat from '../components/ui/DashboardStat.vue'
import DashboardCard from '../components/ui/DashboardCard.vue'
import Bullet from '../components/ui/Bullet.vue'

const headerConfig = {
  title: '대시보드',
  description: '마지막 업데이트: 12:05',
  icon: Monitor
}
</script>