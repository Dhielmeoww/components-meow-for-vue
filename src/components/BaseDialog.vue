<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    :maximized="maximized"
    :full-width="fullWidth"
    :full-height="fullHeight"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <q-card :style="cardStyles" :class="cardClass">
      <!-- Header Section -->
      <q-card-section v-if="hasHeader" :class="headerClass">
        <slot
          name="header"
          :title="title"
          :subtitle="subtitle"
          :icon="icon"
          :close="closeDialog"
        >
          <!-- Default Header -->
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-3">
              <VsxIcon
                v-if="icon"
                :iconName="icon"
                :size="iconSize"
                :color="iconColor"
              />
              <div>
                <h3
                  class="tw-text-lg tw-font-semibold tw-tracking-wide tw-m-0"
                  :class="textColor"
                >
                  {{ title }}
                </h3>
                <p
                  v-if="subtitle"
                  class="tw-text-sm tw-text-gray-600 tw-mt-1 tw-mb-0"
                >
                  {{ subtitle }}
                </p>
              </div>
            </div>
            <slot name="close">
              <q-btn
                v-if="showCloseButton"
                @click="closeDialog"
                flat
                round
                dense
                icon="close"
                size="sm"
                class="tw-text-gray-500 hover:tw-text-gray-700"
              />
            </slot>
          </div>
        </slot>
      </q-card-section>

      <!-- Separator -->
      <!-- <q-separator v-if="hasHeader && showSeparator" class="tw-bg-stroke" /> -->

      <!-- Content Section -->
      <div
        v-if="loading"
        class="tw-absolute tw-inset-0 tw-z-50 tw-bg-white tw-bg-opacity-75 tw-flex tw-items-center tw-justify-center"
      >
        <slot name="loading" :loading="loading">
          <!-- Default Loading Content -->
          <div class="tw-flex tw-flex-col tw-items-center tw-gap-4">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </slot>
      </div>

      <q-card-section :class="contentClass" v-if="!loading">
        <slot name="content" :text="text" :message="message">
          <!-- Default Content -->
          <p
            v-if="text || message"
            class="tw-text-sm md:tw-text-base tw-text-gray-600 tw-m-0"
          >
            {{ text || message }}
          </p>
        </slot>

        <!-- Body slot -->
        <slot name="body"></slot>

        <!-- Default slot for backward compatibility -->
        <slot></slot>
      </q-card-section>

      <!-- Separator -->
      <!-- <q-separator v-if="hasFooter && showSeparator" class="tw-bg-stroke" /> -->

      <!-- Footer Section -->
      <q-card-actions
        v-if="hasFooter"
        :class="footerClass"
        :align="footerAlign"
      >
        <slot
          name="footer"
          :close="closeDialog"
          :submit="onSubmit"
          :loading="loading"
        >
          <!-- Default Footer -->
          <q-btn
            v-if="showCancelButton"
            @click="closeDialog"
            :flat="cancelButtonFlat"
            :label="cancelButtonLabel"
            size="md"
            class="tw-text-xl"
            :disable="loading"
          />
          <q-btn
            v-if="showSubmitButton"
            @click="onSubmit"
            color="green"
            :unelevated="submitButtonUnelevated"
            :label="submitButtonLabel"
            size="md"
            class="tw-text-xl"
            :loading="loading"
            :disable="submitDisabled"
          />
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import VsxIcon from "./VsxIcon.vue";
import { computed, onMounted, getCurrentInstance } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Dialog props
  persistent: {
    type: Boolean,
    default: false,
  },
  maximized: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },

  // Card styling
  cardClass: {
    type: String,
    default: "!tw-rounded-md !tw-shadow-lg tw-py-4",
  },
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 300,
  },

  // Header props
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  iconSize: {
    type: String,
    default: "md",
  },
  iconColor: {
    type: String,
    default: "primary",
  },
  color: {
    type: String,
    default: "",
  },
  showCloseButton: {
    type: Boolean,
    default: false,
  },
  headerClass: {
    type: String,
    default: "tw-flex tw-justify-between tw-px-8",
  },

  // Content props
  text: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  contentClass: {
    type: String,
    default: "tw-py-4",
  },

  // Footer props
  footerAlign: {
    type: String,
    default: "right",
    validator: (value) =>
      ["left", "center", "right", "around", "between", "evenly"].includes(
        value
      ),
  },
  footeralign: {
    type: String,
    default: "",
  },
  footerClass: {
    type: String,
    default: "tw-pt-2",
  },

  // Button props
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  cancelButtonLabel: {
    type: String,
    default: "Batal",
  },
  submitButtonLabel: {
    type: String,
    default: "OK",
  },
  cancelButtonFlat: {
    type: Boolean,
    default: true,
  },
  submitButtonColor: {
    type: String,
    default: "tw-green-200/20",
  },
  submitButtonUnelevated: {
    type: Boolean,
    default: true,
  },
  buttonSize: {
    type: String,
    default: "sm",
  },
  submitDisabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },

  // Layout props
  showSeparator: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "submit", "close"]);

// Computed properties
const hasHeader = computed(() => {
  return (
    props.title || props.subtitle || props.icon || hasSlotContent("header")
  );
});

const hasFooter = computed(() => {
  return hasSlotContent("footer");
});

const textColor = computed(() => {
  if (!props.color) {
    return "text-primary";
  } else {
    return props.color;
  }
});

const cardStyles = computed(() => {
  return `min-width: ${props.width}px; min-height: ${props.height}px;`;
});

// Slot detection helper
const slots = getCurrentInstance()?.slots;
function hasSlotContent(name) {
  return slots && slots[name] && slots[name]().length > 0;
}

// Methods
function closeDialog() {
  emit("update:modelValue", false);
  emit("close");
}

function onSubmit() {
  emit("submit");
}

// Set default width on mount
onMounted(() => {
  // Width default is already handled in prop definition
});
</script>
