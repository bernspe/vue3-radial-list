<template>
  <div class="radial-list" ref="root" :style="rootStyle">
    <ul class="radial-list__ring" role="menu" :aria-label="ariaLabel">
      <li v-for="(item, i) in items" :key="item.id ?? i" class="radial-list__item" :style="itemStyle(i)" role="presentation">
        <button
          :ref="(el) => (itemRefs[i] = el as HTMLButtonElement)"
          class="radial-list__button"
          :aria-label="item.ariaLabel ?? item.label"
          :title="item.label"
          :disabled="item.disabled"
          @click="onSelect(item, i, $event)"
          @keydown="onKeydown($event, i)"
        >
          <span class="radial-list__icon" v-if="item.icon" v-html="item.icon"></span>
          <span class="radial-list__label">{{ item.label }}</span>
        </button>
      </li>
    </ul>

    <!-- center slot for nesting another RadialList -->
    <div class="radial-list__center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type {RadialItem} from "../types.ts";



const props = defineProps<{
  items: RadialItem[]
  /** preferred radius in px; when omitted the component computes a responsive radius based on container size */
  radius?: number
  /** preferred item size in px (width & height). Responsive behavior will scale this if container is small */
  itemSize?: number
  /** gap between items along radius in px (for calculations only) */
  gap?: number
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'select', payload: { item: RadialItem; index: number; event: Event }): void
}>()

const root = ref<HTMLElement | null>(null)
const itemRefs = ref<Array<HTMLButtonElement | null>>([])

const defaultItemSize = props.itemSize ?? 56
const calculatedMaxItemSize = ref(100)
const defaultGap = props.gap ?? 8

const computedRadius = ref(props.radius ?? 0)
const computedRootSize = ref(200)

let ro: ResizeObserver | null = null

function recomputeRadius() {
  if (!root.value) return
  const rect = root.value.getBoundingClientRect()
  const half = Math.min(rect.width, rect.height) / 2
  // leave space for item size and center slot
  const radius = props.radius ?? Math.max(half - (defaultItemSize / 2) - defaultGap - 8, 0)
  const boundingcircle = Math.PI*radius
  if (itemCount.value>0) calculatedMaxItemSize.value=boundingcircle / itemCount.value
  computedRadius.value = radius
  computedRootSize.value = rect.width
}

onMounted(() => {
  recomputeRadius()
  ro = new ResizeObserver(() => recomputeRadius())
  if (root.value) ro.observe(root.value)
})
onBeforeUnmount(() => {
  if (ro && root.value) ro.unobserve(root.value)
  ro = null
})

watch(() => props.radius, () => recomputeRadius())

const itemCount = computed(() => props.items?.length ?? 0)

function angleForIndex(i: number) {
  if (itemCount.value <= 1) return 0
  // distribute evenly around full circle
  return (360 / itemCount.value) * i
}

function itemStyle(i: number) {
  const angle = angleForIndex(i)-90
  const r = computedRadius.value
  const size = Math.min(defaultItemSize,calculatedMaxItemSize.value)
  // translate by radius, but we want transform-origin center
  // rotate(angle) translate(radius) rotate(-angle) keeps item upright
  return {
    width: `${size}px`,
    height: `${size}px`,
    transform: `rotate(${angle}deg) translate(${r}px) rotate(${-angle}deg)`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    margin: `-${size / 2}px 0 0 -${size / 2}px`,
    // ensure focus outline appears
  } as Record<string, string>
}

const rootStyle = computed(() => ({
  'min-height': `${Math.max(computedRootSize.value,160)}px`,
  '--radial-radius': `${computedRadius.value}px`,
  '--radial-item-size': `${Math.min(defaultItemSize,calculatedMaxItemSize.value)}px`
} as Record<string, string>))

function onSelect(item: RadialItem, index: number, e: Event) {
  if (item.disabled) return
  emit('select', { item, index, event: e })
}

function focusItem(i: number) {
  const el = itemRefs.value[i]
  if (el && typeof el.focus === 'function') el.focus()
}

function onKeydown(e: KeyboardEvent, index: number) {
  const key = e.key
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    e.preventDefault()
    const next = (index + 1) % itemCount.value
    focusItem(next)
  } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
    e.preventDefault()
    const prev = (index - 1 + itemCount.value) % itemCount.value
    focusItem(prev)
  } else if (key === 'Home') {
    e.preventDefault()
    focusItem(0)
  } else if (key === 'End') {
    e.preventDefault()
    focusItem(itemCount.value - 1)
  }
}

// ensure refs array length matches items
watch(() => props.items, () => {
  nextTick()
  itemRefs.value = new Array(props.items?.length ?? 0).fill(null)
})
</script>

<style>
.radial-list {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 160px; /* sensible default, override with computedRootSize */
  display: block;
  box-sizing: border-box;
}

.radial-list__ring {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  inset: 0; /* fill container */
  pointer-events: none; /* let buttons handle events */
}

.radial-list__item {
  pointer-events: auto; /* enable clicks */
}

.radial-list__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 3px solid black;
  border-radius: 9px;
  cursor: pointer;
  background: transparent;
  width: var(--radial-item-size, 56px);
  height: var(--radial-item-size, 56px);
  box-sizing: border-box;
  padding: 6px;
}

.radial-list__button:focus {
  outline: 3px solid Highlight;
}
.radial-list__button:hover {
  transform: scale(1.1);
  .radial-list__label {
    display: inline-block;
  }
}

.radial-list__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2em;
  height: 2.2em;
}

.radial-list__label {
  position: absolute;
  background-color: whitesmoke;
  bottom: 10%;
  display: none; /* hide labels to save space; screen-readers still have aria-label */
}

/* center slot for nested RadialList */
.radial-list__center {
  position: absolute;
  width: 70%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* nested lists should manage their own pointer-events */
}

/* Allow nested content to accept pointer events */
.radial-list__center > * {
  pointer-events: auto;
}

/* Responsive: if container is narrow, shrink item size */
@media (max-width: 420px) {
  .radial-list {
    min-height: 120px;
  }
  :root .radial-list {
    --radial-item-size: 44px;
  }
}
</style>
