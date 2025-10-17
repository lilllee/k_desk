<!-- App.vue - 새로운 대시보드 스타일 적용 -->
<template>
  <div class="flex h-screen bg-muted">
    <!-- 새로운 대시보드 사이드바 -->
    <div
      class="sidebar-container"
      :style="{ width: sidebarWidth + 'px' }"
    >
      <Sidebar :class="cn('py-sides')">
        <SidebarHeader class="rounded-t-lg flex gap-3 flex-row rounded-b-none">
          <div style="background-color: oklch(0.4703 0.2364 263.19)"
          class="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary text-sidebar-primary-foreground">
            <div class="logo-icon">K</div>
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="text-2xl font-display">K Desk</span>
            <span class="text-xs uppercase">관리 시스템</span>
          </div>
        </SidebarHeader>

        <SidebarContent class="flex flex-col h-full">
          <div class="flex-1">
            <SidebarGroup>
              <SidebarGroupLabel>
                <Bullet class="mr-2" style="background-color: oklch(0.4703 0.2364 263.19);"/>
                메뉴
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem
                    v-for="item in menu"
                    :key="item.key"
                  >
                    <SidebarMenuButton
                      :is-active="active === item.key"
                      @click="go(item.key)"
                      class="cursor-pointer"
                    >
                      <div class="flex items-center gap-3 w-full">
                        <component :is="getMenuIcon(item.key)" class="size-5" />
                        <span>{{ item.label }}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          <!-- 다크 모드 토글 버튼 -->
          <div class="p-2 border-t border-sidebar-border">
            <SidebarMenuButton
              @click="toggleDarkMode"
              class="cursor-pointer w-full"
            >
              <div class="flex items-center gap-3 w-full">
                <component :is="dark ? Sun : Moon" class="size-5" />
                <span>{{ dark ? '라이트 모드' : '다크 모드' }}</span>
              </div>
            </SidebarMenuButton>
          </div>
        </SidebarContent>
      </Sidebar>

      <!-- 리사이즈 핸들 -->
      <div
        class="resize-handle"
        @mousedown="startResize"
        :style="{ cursor: 'col-resize' }"
      ></div>
    </div>

    <!-- 메인 콘텐츠 영역 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 메인 콘텐츠 -->
      <div class="main-content flex-1 overflow-auto bg-background">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Monitor,
  Users,
  MapPin,
  Database,
  Moon,
  Sun
} from 'lucide-vue-next'

// 대시보드 컴포넌트들 import
import Sidebar from './components/ui/Sidebar.vue'
import SidebarHeader from './components/ui/SidebarHeader.vue'
import SidebarContent from './components/ui/SidebarContent.vue'
import SidebarGroup from './components/ui/SidebarGroup.vue'
import SidebarGroupLabel from './components/ui/SidebarGroupLabel.vue'
import SidebarGroupContent from './components/ui/SidebarGroupContent.vue'
import SidebarMenu from './components/ui/SidebarMenu.vue'
import SidebarMenuItem from './components/ui/SidebarMenuItem.vue'
import SidebarMenuButton from './components/ui/SidebarMenuButton.vue'
import Bullet from './components/ui/Bullet.vue'
import { cn } from './components/ui/utils.js'

const router = useRouter()
const route = useRoute()

// 상태 관리
const sidebarWidth = ref(260)
const dark = ref(false)

// 다크 모드 상태 초기화 (localStorage에서 복원)
function initializeDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    dark.value = JSON.parse(savedDarkMode)
  } else {
    // 기본값 설정 (시스템 다크 모드 감지)
    dark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 초기 다크 모드 적용
  if (dark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 앱 시작 시 다크 모드 초기화
initializeDarkMode()

// 메뉴 데이터
const menu = [
  { label: '대시보드', key: 'dashboard' },
  { label: '회원관리', key: 'members' },
  { label: '좌석 배치', key: 'passes' },
  { label: 'db schema', key: 'dbschema' },
]

// 아이콘 매핑
const getMenuIcon = (key) => {
  const iconMap = {
    dashboard: Monitor,
    members: Users,
    passes: MapPin,
    dbschema: Database
  }
  return iconMap[key] || Monitor
}

// 활성 메뉴 계산
const active = computed(() => {
  if (route.path === '/') return 'dashboard'
  if (route.path === '/members') return 'members'
  if (route.path === '/passes') return 'passes'
  if (route.path === '/dbschema') return 'dbschema'
  return 'dashboard'
})

// 메뉴 클릭 핸들러
function go(key) {
  if (key === 'dashboard') router.push('/')
  if (key === 'members') router.push('/members')
  if (key === 'passes') router.push('/passes')
  if (key === 'dbschema') router.push('/dbschema')
}

// 사이즈 조절 기능
let isResizing = false
let startX = 0
let startWidth = 0

function startResize(e) {
  isResizing = true
  startX = e.clientX
  startWidth = sidebarWidth.value

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function handleResize(e) {
  if (!isResizing) return

  const deltaX = e.clientX - startX
  const newWidth = Math.max(200, Math.min(400, startWidth + deltaX))
  sidebarWidth.value = newWidth
}

function stopResize() {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// 다크 모드 토글 함수
function toggleDarkMode() {
  dark.value = !dark.value

  // localStorage에 상태 저장
  localStorage.setItem('darkMode', JSON.stringify(dark.value))

  // 다크 모드 클래스를 documentElement에 추가/제거
  if (dark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.sidebar-container {
  position: relative;
  transition: width 0.2s ease;
  background: var(--color-sidebar);
  border-right: 1px solid var(--color-sidebar-border);
}


.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: transparent;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle:hover {
  background: var(--color-sidebar-border);
}

.main-header {
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-foreground);
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: none;
  background: transparent;
  color: var(--color-foreground);
}

.action-btn:hover {
  background: var(--color-accent);
}

.main-content {
  flex: 1;
  overflow: auto;
  background: var(--color-background);
  padding: 1rem;
}

/* 사이드바 애니메이션 */
.sidebar-container .sidebar-content {
  transition: all 0.2s ease;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
  }
}
</style>
