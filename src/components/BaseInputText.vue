<template>
  <div class="tw-w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="[
        'tw-block tw-text-sm tw-text-gray-700 tw-mb-2',
        labelClass,
        labelSemibold ? 'tw-font-semibold' : 'tw-font-normal',
      ]"
    >
      {{ label }}
      <span v-if="required" class="tw-text-red-500 tw-ml-1">*</span>
    </label>

    <!-- Input Field -->
    <q-input
      :id="inputId"
      v-model="inputValue"
      :placeholder="placeholder"
      :outlined="outlined"
      :filled="filled"
      :dense="dense"
      :disable="disabled"
      :readonly="readonly"
      :type="computedType"
      :rules="computedRules"
      :hide-bottom-space="hideBottomSpace"
      :class="inputClass"
      class="elegant-input"
      v-bind="$attrs"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <!-- Prepend Icon Slot -->
      <template v-if="prependIcon || $slots.prepend" #prepend>
        <slot name="prepend">
          <VsxIcon
            v-if="prependIcon"
            :iconName="prependIcon"
            :size="iconSize"
            class="tw-text-gray-500"
            :class="prependIconClass"
          />
        </slot>
      </template>

      <!-- Append Icon Slot -->
      <template v-if="appendIcon || $slots.append || isPasswordType" #append>
        <slot name="append">
          <!-- Password Toggle Icon -->
          <VsxIcon
            v-if="isPasswordType"
            :iconName="showPassword ? 'EyeSlash' : 'Eye'"
            :size="iconSize"
            class="tw-text-gray-500 tw-cursor-pointer hover:tw-text-gray-700 tw-transition-colors"
            :class="appendIconClass"
            @click="togglePasswordVisibility"
          />
          <!-- Regular Append Icon -->
          <VsxIcon
            v-else-if="appendIcon"
            :iconName="appendIcon"
            :size="iconSize"
            class="tw-text-gray-500"
            :class="appendIconClass"
          />
        </slot>
      </template>
    </q-input>

    <!-- Error Message -->
    <div
      v-if="errorMessage && !hideBottomSpace"
      class="tw-text-red-500 tw-text-xs tw-mt-1"
    >
      {{ errorMessage }}
    </div>

    <!-- Helper Text -->
    <div
      v-if="helperText && !errorMessage && !hideBottomSpace"
      class="tw-text-gray-500 tw-text-xs tw-mt-1"
    >
      {{ helperText }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { uid } from "quasar";
import VsxIcon from "./VsxIcon.vue";

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  outlined: {
    type: Boolean,
    default: true,
  },
  filled: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  hideBottomSpace: {
    type: Boolean,
    default: true,
  },
  showPasswordToggle: {
    type: Boolean,
    default: true,
  },
  appendIcon: {
    type: String,
    default: "",
  },
  iconSize: {
    type: [String, Number],
    default: "16",
  },
  errorMessage: {
    type: String,
    default: "",
  },
  helperText: {
    type: String,
    default: "",
  },
  labelClass: {
    type: String,
    default: "",
  },
  labelSemibold: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: "",
  },
  prependIconClass: {
    type: String,
    default: "",
  },
  appendIconClass: {
    type: String,
    default: "",
  },
  prependIcon: {
    type: String,
    default: "",
  },
  // New prop for enabling HTML decoding
  decodeHtml: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "blur", "focus", "input"]);

// Reactive data
const inputId = ref(`input-${uid()}`);
const isFocused = ref(false);
const showPassword = ref(false);

// HTML decoding utility function
const decodeHtmlEntities = (text) => {
  if (!text || typeof text !== "string") return text;

  // Create a temporary element to decode HTML entities
  const tempElement = document.createElement("div");

  // First decode Unicode escapes like \u003cbr\u003e
  let decodedText = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, unicode) => {
    return String.fromCharCode(parseInt(unicode, 16));
  });

  // Then decode HTML entities
  tempElement.innerHTML = decodedText;
  const fullyDecoded = tempElement.textContent || tempElement.innerText || "";

  // Convert <br> tags to line breaks for textarea
  return fullyDecoded.replace(/<br\s*\/?>/gi, "\n");
};

// Computed
const inputValue = computed({
  get: () => {
    if (props.decodeHtml && props.modelValue) {
      return decodeHtmlEntities(props.modelValue);
    }
    return props.modelValue;
  },
  set: (value) => emit("update:modelValue", value),
});

const isPasswordType = computed(() => {
  return props.type === "password";
});

const computedType = computed(() => {
  if (isPasswordType.value && props.showPasswordToggle) {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

const computedRules = computed(() => {
  const rules = [...props.rules];

  if (props.required) {
    rules.unshift((val) => {
      if (val === null || val === undefined || val === "") {
        return `${props.label || "Field"} is required`;
      }
      return true;
    });
  }

  return rules;
});

// Methods
const handleInput = (value) => {
  emit("input", value);
  emit("update:modelValue", value);
};

const handleFocus = (evt) => {
  isFocused.value = true;
  emit("focus", evt);
};

const handleBlur = (evt) => {
  isFocused.value = false;
  emit("blur", evt);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Watch for external validation errors
watch(
  () => props.errorMessage,
  (newError) => {
    if (newError) {
      // Handle external validation error
    }
  }
);

// Watch for modelValue changes to decode HTML when prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.decodeHtml && newValue) {
      // The computed property will handle the decoding
    }
  }
);
</script>

<style scoped>
/* Custom styles for elegant input */
:deep(.elegant-input .q-field__control) {
  @apply tw-transition-all tw-duration-200;
}

:deep(.elegant-input .q-field--outlined .q-field__control:before) {
  @apply tw-border-gray-300;
}

:deep(.elegant-input .q-field--outlined .q-field__control:hover:before) {
  @apply tw-border-gray-400;
}

:deep(
    .elegant-input .q-field--outlined.q-field--focused .q-field__control:before
  ) {
  @apply tw-border-blue-500;
}

:deep(.elegant-input .q-field__native) {
  @apply tw-text-gray-900 tw-text-sm;
}

:deep(.elegant-input .q-field__label) {
  @apply tw-text-gray-500 tw-text-sm;
}

:deep(.elegant-input .q-placeholder) {
  @apply tw-text-gray-400;
}

/* Error state */
:deep(.elegant-input.q-field--error .q-field__control:before) {
  @apply tw-border-red-500;
}

/* Disabled state */
:deep(.elegant-input.q-field--disabled) {
  @apply tw-opacity-60;
}

:deep(.elegant-input.q-field--disabled .q-field__control) {
  @apply tw-bg-gray-50;
}

/* Textarea specific styles */
:deep(.elegant-input .q-field__native[type="textarea"]) {
  @apply tw-whitespace-pre-wrap;
}
</style>
