<template>
    <VsxIcon :iconName="iconName" :color="color" :size="size" type="linear" :variant="variant" />
  </template>
  
  <script setup>
  import { VsxIcon } from "vue-iconsax";
  
  defineProps({
    iconName: String,
    color: String,
    size: Number,
    variant: String
  });
  </script>
  
  <style></style>
  