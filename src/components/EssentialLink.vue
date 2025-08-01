<template>
  <q-item
    v-if="!hasChildren"
    clickable
    tag="a"
    :to="props.url"
    class="essential-link"
  >
    <q-item-section v-if="props.iconsax" avatar>
      <VsxIcon :iconName="props.iconsax" size="20" class="menu-icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="menu-label">{{ props.name }}</q-item-label>
      <q-item-label v-if="props.description" caption class="menu-description">
        {{ props.description }}
      </q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item v-else class="menu-expansion" :header-inset-level="0">
    <template v-slot:header>
      <q-item-section avatar v-if="props.iconsax">
        <VsxIcon :iconName="props.iconsax" size="20" class="parent-icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="parent-label">{{ props.name }}</q-item-label>
        <q-item-label
          v-if="props.description"
          caption
          class="parent-description"
        >
          {{ props.description }}
        </q-item-label>
      </q-item-section>
    </template>

    <div class="submenu-container tw-pl-5">
      <EssentialLink
        v-for="child in props.children"
        :key="child.id"
        :name="child.nama_menu"
        :description="child.description"
        :url="child.link"
        :iconsax="child.iconsax"
        :children="child.children"
      />
    </div>
  </q-expansion-item>
</template>

<script setup>
import { computed } from "vue";
import VsxIcon from "./VsxIcon.vue";
import EssentialLink from "./EssentialLink.vue"; // Tambahkan ini

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "#",
  },
  icon: {
    type: String,
    default: "",
  },
  iconsax: {
    type: String,
    default: "",
  },
  isHeader: {
    type: Boolean,
    default: false,
  },
  children: {
    type: Array,
    default: () => [],
  },
  parentID: {
    type: Number,
    default: 0,
  },
});

const hasChildren = computed(() => props.children && props.children.length > 0);
</script>
