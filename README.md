# Vue3RadialList <img src="public/circle_menu.svg" alt="Circular Menu Logo" width="50"/>
A Vue3Typescript component that displays a list of items in a circular layout.

## Features
- Circular arrangement of list items
- Customizable radius and item size
- Nested RadialLists
- Responsive design
## Installation
You can install RadialList via npm:
```bash
npm install vue3-radial-list
```
## Usage
Import the RadialList component and use it in your Vue3 application:
### Import RadialList component
```vue
import {RadialList} from "vue3-radial-list";
import type {RadialItem} from "vue3-radial-list";
import "vue3-radial-list/dist/vue3-radial-list.css"
```
### Example Radial List Menu
```vue
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
import {RadialList} from "vue3-radial-list";
import type {RadialItem} from "vue3-radial-list";
import "vue3-radial-list/dist/vue3-radial-list.css"


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
 ```



