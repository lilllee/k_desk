// App.vue JavaScript Logic
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NConfigProvider, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NButton, darkTheme } from 'naive-ui'
import { Moon, Sun } from 'lucide-vue-next'

export default {
  name: 'App',
  components: {
    NConfigProvider,
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NButton,
    Moon,
    Sun
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const dark = ref(true)
    const collapsed = ref(true)
    const sidebarWidth = ref(260)
    let hoverTimeout = null

    const menu = [
      { label: '대시보드', key: 'dashboard' },
      { label: '회원관리', key: 'members' },
      { label: '좌석 배치', key: 'passes' },
      { label: 'db schema', key: 'dbschema' },
    ]

    const active = computed(() => {
      // 현재 경로에 따라 활성 메뉴 결정
      if (route.path === '/') return 'dashboard'
      if (route.path === '/members') return 'members'
      if (route.path === '/passes') return 'passes'
      if (route.path === '/dbschema') return 'dbschema'
      return 'dashboard'
    })

    function go(key) {
      // 메뉴 클릭 시 해당 경로로 이동
      if (key === 'dashboard') router.push('/')
      if (key === 'members') router.push('/members')
      if (key === 'passes') router.push('/passes')
      if (key === 'dbschema') router.push('/dbschema')
    }

    function getCurrentPageTitle() {
      const menuItem = menu.find(item => item.key === active.value)
      return menuItem ? menuItem.label : '대시보드'
    }

    function getPageSubtitle() {
      const subtitles = {
        dashboard: '시스템 개요 및 주요 지표',
        members: '회원 정보 관리 및 통계',
        passes: '좌석 배치',
        dbschema: 'db schema'
      }
      return subtitles[active.value] || '관리자 대시보드'
    }

    // 마우스 호버 이벤트 핸들러
    function handleMouseEnter() {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
      collapsed.value = false
    }

    function handleMouseLeave() {
      hoverTimeout = setTimeout(() => {
        collapsed.value = true
      }, 300)
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
    }

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    })

    return {
      dark,
      darkTheme,
      // collapsed,
      // sidebarWidth,
      menu,
      active,
      go,
      getCurrentPageTitle,
      getPageSubtitle,
      // handleMouseEnter,
      // handleMouseLeave,
      startResize,
      toggleDarkMode,
      Moon,
      Sun
    }
  }
}
