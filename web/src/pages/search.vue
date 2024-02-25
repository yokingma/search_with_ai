<template>
  <div class="w-full h-full relative overflow-hidden">
    <div class="absolute top-4 bottom-4 left-0 right-0 rounded-2xl bg-gray-100 p-2">
      <div class="max-h-full bg-white rounded-2xl p-4">
        {{ query.q }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '../router';
const query = router.currentRoute.value.query
</script>

<script lang="ts">
export default {
  name: 'SearchPage'
}
</script>
