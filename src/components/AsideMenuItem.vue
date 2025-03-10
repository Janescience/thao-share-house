<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useStyleStore } from '@/stores/style.js'
import { useMainStore } from '@/stores/main'
import { mdiMinus, mdiPlus } from '@mdi/js'
import BaseIcon from '@/components/BaseIcon.vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
import PillTag from '@/components/PillTag.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSubmenuList: Boolean
})

const emit = defineEmits(['menu-click'])
const mainStore = useMainStore();

const styleStore = useStyleStore()

const isDropdownActive = ref(false)

const hasDropdown = computed(() => !!props.item.menu)

const menuClick = event => {
  emit('menu-click', event, props.item)

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value
  }
}
</script>

<template>
  <li>
    <component
      :is="item.to ? RouterLink : 'a'"
      v-slot="vSlot"
      :to="item.to || null"
      :href="item.href || null"
      :target="item.target || null"
      class="flex cursor-pointer dark:hover:bg-gray-700/50"
      :class="[ styleStore.asideMenuItemStyle, isSubmenuList ? 'p-3 text-sm' : 'py-2 ' ]"
      @click="menuClick"
    >
      <BaseIcon
        v-if="item.icon"
        size="20"
        :path="item.icon"
        class="flex-none"
        :class="[ vSlot && vSlot.isExactActive ? styleStore.asideMenuItemActiveStyle : styleStore.asideMenuItemInactiveStyle ]"
        w="w-12"
        h=""
      />
      <span
        class="grow"
        :class="[ vSlot && vSlot.isExactActive ? styleStore.asideMenuItemActiveStyle : styleStore.asideMenuItemInactiveStyle ]"
      >{{ item.label }}
      
      <PillTag
        v-if="item.countData && mainStore[item.countData] > 0"
        :text="mainStore[item.countData]"
        type="light"
        small="true"
      />

      </span>
      
      <BaseIcon
        v-if="hasDropdown"
        :path="isDropdownActive ? mdiMinus : mdiPlus"
        class="flex-none"
        :class="[ vSlot && vSlot.isExactActive ? styleStore.asideMenuItemActiveStyle : styleStore.asideMenuItemInactiveStyle ]"
        w="w-12"
      />
    </component>
    <AsideMenuList
      v-if="hasDropdown"
      :menu="item.menu"
      :class="[ styleStore.asideSubmenuListStyle, isDropdownActive ? 'block dark:bg-gray-800/50' : 'hidden' ]"
      is-submenu-list
    />
  </li>
</template>
