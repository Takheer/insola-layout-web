<script lang="ts" setup>
import HeaderBar from "@/components/HeaderBar.vue";
import { IKButton } from "insola-tech-ui-kit";
console.log({IKButton})
</script>

<template>
  <HeaderBar class="h-[8vh] md:h-[6vh]"/>
  <RouterView class="h-[92vh] md:h-[94vh]" />
</template>
