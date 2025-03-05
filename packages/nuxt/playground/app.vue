<script setup lang="ts">
import { useContentoClient } from '#imports'

const client = await useContentoClient()
console.log(client)
</script>

<template>
  <div>Nuxt module playground!</div>
</template>
