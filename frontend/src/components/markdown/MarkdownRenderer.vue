<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { computed } from 'vue';

const props = defineProps<{
  content: string;
}>();

function escapeHtml(code: string) {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code: string, language: string): string {
    if (language && hljs.getLanguage(language)) {
      return `<pre><code class="hljs language-${language}">${hljs.highlight(code, { language }).value}</code></pre>`;
    }

    return `<pre><code class="hljs">${escapeHtml(code)}</code></pre>`;
  }
});

const html = computed(() => md.render(props.content));
</script>

<template>
  <div class="markdown-body" v-html="html" />
</template>
