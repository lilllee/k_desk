import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NConfigProvider, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NButton, darkTheme } from 'naive-ui'
import { Moon, Sun } from 'lucide-vue-next'

export default {
    name: 'User',
    data() {
        return {
          userCount: 100,
          activePassCount: 100,
          seatUsageRate: "20%"
        }
      },
    mounted() {
        // 좌석 사용률, 활성 패스, 현재 등록된 회원수 조회
        this.getSeatUsageRate()
        this.getActivePass()
        this.getCurrentUsers()
    },
    methods: {
        getSeatUsageRate() {
            console.log('getSeatUsageRate')
        },
        getActivePass() {
            console.log('getActivePass')
        },
        async getCurrentUsers() {
            const result = await window.api.getAllUserCount()
            this.userCount = result.data;
        }
    }
}

