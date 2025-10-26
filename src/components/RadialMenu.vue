<template>
  <div class="menu-wrapper">
    <RadialList :items="outerItems"
                :item-size="80"
                @select="onSelect">
      <RadialList :items="innerItems" @select="onSelect" :item-size="120">

      </RadialList>
    </RadialList>
  </div>
</template>

<script setup lang="ts">
import RadialList from './RadialList.vue'
import type {RadialItem} from "../types.ts"

interface Item {
  id: string
  label: string
  icon: string
}

const outerItems: Item[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'logout', label: 'Logout', icon: '🚪' },
  { id: 'info', label: 'Info', icon: 'ℹ️' }
]

const innerItems: Item[] = [
  { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'camera', label: 'Camera', icon: '📷' },
  { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'help', label: 'Help', icon: '❓' },
  { id: 'chat', label: 'Chat', icon: '💬' }
]

function onSelect(payload:{ item: RadialItem, index: number, event: Event }) {
  console.log(`Clicked on ${payload.item.label}`)
}
</script>

<style scoped>
.menu-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #fdfdfd, #eaeaea);
}
</style>
