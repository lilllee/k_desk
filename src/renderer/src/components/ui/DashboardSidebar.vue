<template>
    <Sidebar :class="cn('py-sides', className)" v-bind="$attrs">
      <SidebarHeader class="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div class="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary text-sidebar-primary-foreground">
          <component :is="MonkeyIcon" class="size-10 group-hover:scale-[1.7] origin-top-left transition-transform" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="text-2xl font-display">M.O.N.K.Y.</span>
          <span class="text-xs uppercase">The OS for Rebels</span>
        </div>
      </SidebarHeader>
  
      <SidebarContent>
        <SidebarGroup
          v-for="(group, i) in data.navMain"
          :key="group.title"
          :class="cn(i === 0 && 'rounded-t-none')"
        >
          <SidebarGroupLabel>
            <Bullet class="mr-2" />
            {{ group.title }}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                v-for="item in group.items"
                :key="item.title"
                :class="cn(
                  item.locked && 'pointer-events-none opacity-50'
                )"
                :data-disabled="item.locked"
              >
                <SidebarMenuButton
                  :is-active="item.isActive"
                  :disabled="item.locked"
                  :class="cn(
                    'disabled:cursor-not-allowed',
                    item.locked && 'pointer-events-none'
                  )"
                >
                  <template v-if="item.locked">
                    <div class="flex items-center gap-3 w-full">
                      <component :is="item.icon" class="size-5" />
                      <span>{{ item.title }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <a :href="item.url" class="flex items-center gap-3 w-full">
                      <component :is="item.icon" class="size-5" />
                      <span>{{ item.title }}</span>
                    </a>
                  </template>
                </SidebarMenuButton>
                <SidebarMenuBadge v-if="item.locked">
                  <component :is="LockIcon" class="size-5 block" />
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
  
      <SidebarFooter class="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet class="mr-2" />
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger class="flex gap-0.5 w-full group cursor-pointer">
                    <div class="shrink-0 flex size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-clip">
                      <img
                        :src="data.user.avatar"
                        :alt="data.user.name"
                        width="120"
                        height="120"
                      />
                    </div>
                    <div class="group/item pl-3 pr-1.5 pt-2 pb-1.5 flex-1 flex bg-sidebar-accent hover:bg-sidebar-accent-active/75 items-center rounded group-data-[state=open]:bg-sidebar-accent-active group-data-[state=open]:hover:bg-sidebar-accent-active group-data-[state=open]:text-sidebar-accent-foreground">
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate text-xl font-display">
                          {{ data.user.name }}
                        </span>
                        <span class="truncate text-xs uppercase opacity-50 group-hover/item:opacity-100">
                          {{ data.user.email }}
                        </span>
                      </div>
                      <component :is="DotsVerticalIcon" class="ml-auto size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    class="w-56 p-0"
                    side="bottom"
                    align="end"
                    :side-offset="4"
                  >
                    <div class="flex flex-col">
                      <button class="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <component :is="MonkeyIcon" class="mr-2 h-4 w-4" />
                        Account
                      </button>
                      <button class="flex items-center px-4 py-2 text-sm hover:bg-accent">
                        <component :is="GearIcon" class="mr-2 h-4 w-4" />
                        Settings
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
  
      <SidebarRail />
    </Sidebar>
  </template>
  
  <script setup>
  import { cn } from './utils.js'
  import Sidebar from './Sidebar.vue'
  import SidebarHeader from './SidebarHeader.vue'
  import SidebarContent from './SidebarContent.vue'
  import SidebarFooter from './SidebarFooter.vue'
  import SidebarGroup from './SidebarGroup.vue'
  import SidebarGroupLabel from './SidebarGroupLabel.vue'
  import SidebarGroupContent from './SidebarGroupContent.vue'
  import SidebarMenu from './SidebarMenu.vue'
  import SidebarMenuItem from './SidebarMenuItem.vue'
  import SidebarMenuButton from './SidebarMenuButton.vue'
  import SidebarMenuBadge from './SidebarMenuBadge.vue'
  import SidebarRail from './SidebarRail.vue'
  import Popover from './Popover.vue'
  import PopoverTrigger from './PopoverTrigger.vue'
  import PopoverContent from './PopoverContent.vue'
  import Bullet from './Bullet.vue'
  
  // 아이콘들을 import (lucide-vue-next에서)
  import { 
    Atom, 
    Brackets, 
    Cpu, 
    Bot, 
    Mail, 
    Settings, 
    MoreVertical, 
    Lock 
  } from 'lucide-vue-next'
  
  const props = defineProps({
    className: {
      type: String,
      default: ''
    }
  })
  
  // 아이콘 매핑
  const AtomIcon = Atom
  const BracketsIcon = Brackets
  const ProcessorIcon = Cpu
  const CuteRobotIcon = Bot
  const EmailIcon = Mail
  const GearIcon = Settings
  const MonkeyIcon = Bot // 원본에서는 별도 아이콘 사용
  const DotsVerticalIcon = MoreVertical
  const LockIcon = Lock
  
  // 사이드바 데이터
  const data = {
    navMain: [
      {
        title: "Tools",
        items: [
          {
            title: "Overview",
            url: "/",
            icon: BracketsIcon,
            isActive: true,
          },
          {
            title: "Laboratory",
            url: "/laboratory",
            icon: AtomIcon,
            isActive: false,
          },
          {
            title: "Devices",
            url: "/devices",
            icon: ProcessorIcon,
            isActive: false,
          },
          {
            title: "Security",
            url: "/security",
            icon: CuteRobotIcon,
            isActive: false,
          },
          {
            title: "Communication",
            url: "/communication",
            icon: EmailIcon,
            isActive: false,
          },
          {
            title: "Admin Settings",
            url: "/admin",
            icon: GearIcon,
            isActive: false,
            locked: true,
          },
        ],
      },
    ],
    desktop: {
      title: "Desktop (Online)",
      status: "online",
    },
    user: {
      name: "KRIMSON",
      email: "krimson@joyco.studio",
      avatar: "/avatars/user_krimson.png",
    },
  }
  </script>