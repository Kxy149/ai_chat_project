<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  username?: string;
  avatarUrl?: string | null;
  size?: number;
}>();

const presetMap: Record<string, string> = {
  'preset:blue': '#2563eb',
  'preset:teal': '#0f766e',
  'preset:rose': '#e11d48',
  'preset:amber': '#d97706',
  'preset:violet': '#7c3aed',
  'preset:slate': '#475569'
};

const sizePx = computed(() => `${props.size ?? 36}px`);
const initial = computed(() => (props.username?.trim().slice(0, 1) || 'U').toUpperCase());
const isImage = computed(() => Boolean(props.avatarUrl && !props.avatarUrl.startsWith('preset:')));
const background = computed(() => presetMap[props.avatarUrl ?? 'preset:blue'] ?? presetMap['preset:blue']);
</script>

<template>
  <img v-if="isImage" class="user-avatar image" :src="avatarUrl || ''" :alt="username || 'avatar'" />
  <span v-else class="user-avatar preset" :style="{ backgroundColor: background }">{{ initial }}</span>
</template>

<style scoped>
.user-avatar {
  display: inline-grid;
  width: v-bind(sizePx);
  height: v-bind(sizePx);
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 700;
  line-height: 1;
  object-fit: cover;
}
</style>
