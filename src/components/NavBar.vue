<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main.js'
import { useStyleStore } from '@/stores/style.js'
import { useLayoutStore } from '@/stores/layout.js'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiClose,
  mdiDotsVertical,
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiGithub,
  mdiThemeLightDark,
  mdiMonitorShimmer,
  mdiOpenInNew
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import NavBarItemLabel from '@/components/NavBarItemLabel.vue'
import NavBarMenu from '@/components/NavBarMenu.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import UserAvatarCurrentUser from '@/components/UserAvatarCurrentUser.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import NavBarSearch from '@/components/NavBarSearch.vue'

import AuthService from '@/services/auth'
import moment from 'moment'

const mainStore = useMainStore()

const router = useRouter()

const nameHome = computed(() => mainStore.currentUser.userInfo.nameHome)

const styleStore = useStyleStore()

const toggleLightDark = () => {
  styleStore.setDarkMode()
}

const layoutStore = useLayoutStore()

const isAsideMobileExpanded = computed(() => layoutStore.isAsideMobileExpanded)

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? 'backburger' : 'forwardburger')

const menuToggleMobile = () => layoutStore.asideMobileToggle()

const isMenuNavBarActive = ref(false)

const menuNavBarToggleIcon = computed(() => isMenuNavBarActive.value ? 'close' : 'dotsVertical')

const menuNavBarToggle = () => {
  isMenuNavBarActive.value = !isMenuNavBarActive.value
}

const menuOpenLg = () => {
  layoutStore.asideLgToggle(true)
}

const logout = () => {
  AuthService.logout();
  router.push("/login")
}
</script>

<template>
  <nav
    class="top-0 left-0 right-0 fixed flex bg-white h-14 border-b border-gray-100 z-30 w-screen
    transition-position xl:pl-52 lg:w-auto lg:items-stretch dark:bg-gray-900 dark:border-gray-800"
    :class="{'ml-52 lg:ml-0':isAsideMobileExpanded}"
  >
    <div class="flex-1 items-stretch flex h-14">
      <NavBarItem
        type="flex lg:hidden"
        @click.prevent="menuToggleMobile"
      >
        <BaseIcon
          :path="menuToggleMobileIcon"
          size="24"
        />
      </NavBarItem>
      <NavBarItem
        type="hidden lg:flex xl:hidden"
        @click.prevent="menuOpenLg"
      >
        <BaseIcon
          path="menu"
          size="24"
        />
      </NavBarItem>
      <NavBarItem>
        <BaseIcon
          path="calendarOutline"
        />
        {{ moment(new Date()).format('DD/MM/YYYY') }}
      </NavBarItem>
    </div>
    <div class="flex-none items-stretch flex h-14 lg:hidden">
      <NavBarItem @click.prevent="menuNavBarToggle">
        <BaseIcon
          :path="menuNavBarToggleIcon"
          size="24"
        />
      </NavBarItem>
    </div>
    <div
      class="absolute w-screen top-14 left-0 bg-white shadow
        lg:w-auto lg:items-stretch lg:flex lg:grow lg:static lg:border-b-0 lg:overflow-visible lg:shadow-none dark:bg-gray-900"
      :class="[isMenuNavBarActive ? 'block' : 'hidden']"
    >
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible lg:flex lg:items-stretch lg:justify-end lg:ml-auto"
      >
        <!-- <div class="hidden lg:flex items-center">
          <a
            class="inline-flex items-center justify-center lg:mr-3 bg-blue-300 hover:bg-blue-400 transition-colors py-1 px-4 text-blue-700 hover:text-blue-800 text-sm rounded-full"
            target="_blank"
            href="https://tailwind-vue.justboil.me/"
          >
            <span class="mr-1">Check premium</span>
            <BaseIcon
              :path="mdiOpenInNew"
              w="w-4"
              h="h-4"
            />
          </a>
        </div> -->
        <!-- <NavBarItem
          class="lg:hidden" 
          target="_blank"
          href="https://tailwind-vue.justboil.me/"
        >
          <NavBarItemLabel
            :icon="mdiMonitorShimmer"
            label="Premium version"
          />
        </NavBarItem> -->
        <!-- <NavBarMenu has-divider>
          <NavBarItemLabel
            :icon="mdiMenu"
            label="Sample menu"
          />

          <template #dropdown>
            <NavBarItem>
              <NavBarItemLabel
                :icon="mdiClockOutline"
                label="Item One"
              />
            </NavBarItem>
            <NavBarItem>
              <NavBarItemLabel
                :icon="mdiCloud"
                label="Item Two"
              />
            </NavBarItem>
            <BaseDivider nav-bar />
            <NavBarItem>
              <NavBarItemLabel
                :icon="mdiCrop"
                label="Item Last"
              />
            </NavBarItem>
          </template>
        </NavBarMenu> -->
        <NavBarMenu has-divider>
          <NavBarItemLabel :label="nameHome">
            <UserAvatarCurrentUser class="w-6 h-6 mr-3 inline-flex" />
          </NavBarItemLabel>

          <template #dropdown>
            <NavBarItem to="/profile">
              <NavBarItemLabel
                icon="account"
                label="My Profile"
              />
            </NavBarItem>
            <NavBarItem>
              <NavBarItemLabel
                icon="cogOutline"
                label="Settings"
              />
            </NavBarItem>
            <NavBarItem>
              <NavBarItemLabel
                icon="email"
                label="Messages"
              />
            </NavBarItem>
            <BaseDivider nav-bar />
            <NavBarItem>
              <NavBarItemLabel
                icon="logout"
                label="Log Out"
              />
            </NavBarItem>
          </template>
        </NavBarMenu>
        <NavBarItem
          has-divider
          is-desktop-icon-only
          @click.prevent="toggleLightDark"
        >
          <NavBarItemLabel
            icon="themeLightDark"
            label="Light/Dark"
            is-desktop-icon-only
          />
        </NavBarItem>
        <!-- <NavBarItem
          href="https://github.com/justboil/admin-one-vue-tailwind"
          has-divider
          is-desktop-icon-only
        >
          <NavBarItemLabel
            :icon="mdiGithub"
            label="GitHub"
            is-desktop-icon-only
          />
        </NavBarItem> -->
        <NavBarItem
          is-desktop-icon-only
          @click="logout"
        >
          <NavBarItemLabel
            icon="logout"
            label="Log out"
            is-desktop-icon-only
          />
        </NavBarItem>
      </div>
    </div>
  </nav>
</template>
