<template>
  <div class="elegant-select">
    <label v-if="label" class="select-label">
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>

    <div class="select-wrapper">
      <q-input
        :model-value="displayValue"
        :placeholder="placeholder"
        :rules="computedRules"
        :error-message="errorMessage"
        :dense="dense"
        :readonly="!searchable || !isOpen"
        :disable="disable"
        :clearable="clearable && hasValue"
        :outlined="true"
        class="select-input"
        @clear="clearSelection"
        @click="handleInputClick"
        @input="handleInputChange"
        @keydown="handleKeydown"
        @focus="handleInputFocus"
        ref="inputRef"
      >
        <template #prepend v-if="prependIcon">
          <VsxIcon :icon-name="prependIcon" size="16" />
        </template>

        <template #append>
          <q-icon
            :name="isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            class="dropdown-arrow"
            :class="{ 'dropdown-arrow--open': isOpen }"
            @click="toggleDropdown"
          />
        </template>
      </q-input>

      <!-- Dropdown Options -->
      <transition name="dropdown">
        <div v-if="isOpen && !disable" class="options-dropdown">
          <!-- Search Input (shown only when not using inline search) -->
          <div v-if="searchable && !useInlineSearch" class="search-container">
            <q-input
              v-model="searchQuery"
              placeholder="Cari..."
              dense
              borderless
              autofocus
              class="search-input"
              @input="handleSearchInput"
            >
              <template #prepend>
                <VsxIcon
                  icon-name="SearchStatus1"
                  size="16"
                  class="search-icon tw-ml-5"
                />
              </template>
            </q-input>
          </div>

          <!-- Options List -->
          <div
            class="tw-max-h-60 tw-overflow-y-auto tw-py-2"
            ref="optionsListRef"
          >
            <!-- No Results -->
            <div
              v-if="filteredOptions.length === 0"
              class="tw-px-4 tw-py-8 tw-text-center"
            >
              <div class="tw-mb-3">
                <q-icon
                  :name="searchQuery ? 'search_off' : 'inbox'"
                  class="tw-text-4xl tw-text-gray-300"
                />
              </div>
              <div class="tw-text-sm tw-text-gray-500 tw-font-medium">
                {{
                  searchQuery
                    ? "Tidak ada hasil ditemukan"
                    : "Tidak ada opsi tersedia"
                }}
              </div>
              <div
                v-if="searchQuery"
                class="tw-text-xs tw-text-gray-400 tw-mt-1"
              >
                Coba kata kunci yang berbeda
              </div>
            </div>

            <!-- Options -->
            <div
              v-for="(option, index) in filteredOptions"
              :key="getOptionValue(option)"
              class="tw-mx-2 tw-mb-1 tw-rounded-lg tw-cursor-pointer tw-transition-all tw-duration-200 tw-group hover:tw-shadow-sm"
              :class="{
                'tw-bg-blue-50 tw-border tw-border-blue-200 tw-shadow-sm':
                  isSelected(option),
                'tw-bg-gray-50 tw-shadow-sm':
                  highlightedIndex === index && !isSelected(option),
                'hover:tw-bg-gray-50':
                  !isSelected(option) && highlightedIndex !== index,
              }"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
            >
              <div
                class="tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-3"
              >
                <div
                  class="tw-flex tw-items-center tw-space-x-3 tw-min-w-0 tw-flex-1"
                >
                  <!-- Option Icon -->
                  <div
                    v-if="getOptionIcon(option)"
                    class="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-transition-colors"
                    :class="{
                      'tw-bg-blue-100 tw-text-blue-600': isSelected(option),
                      'tw-bg-gray-100 tw-text-gray-500': !isSelected(option),
                    }"
                  >
                    <q-icon :name="getOptionIcon(option)" class="tw-text-lg" />
                  </div>

                  <!-- Option Text -->
                  <div class="tw-min-w-0 tw-flex-1">
                    <div
                      class="tw-font-medium tw-text-sm tw-text-gray-900 tw-truncate tw-transition-colors"
                      :class="{ 'tw-text-blue-700': isSelected(option) }"
                      v-html="highlightMatch(getOptionLabel(option))"
                    ></div>
                    <div
                      v-if="option.description"
                      class="tw-text-xs tw-text-gray-500 tw-mt-0.5 tw-line-clamp-2 tw-transition-colors"
                      :class="{ 'tw-text-blue-600': isSelected(option) }"
                      v-html="highlightMatch(option.description)"
                    ></div>
                  </div>
                </div>

                <!-- Selected Indicator -->
                <div
                  v-if="isSelected(option)"
                  class="tw-flex-shrink-0 tw-w-6 tw-h-6 tw-bg-blue-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-ml-3"
                >
                  <q-icon name="check" class="tw-text-white tw-text-sm" />
                </div>

                <!-- Hover Indicator -->
                <div
                  v-else-if="highlightedIndex === index"
                  class="tw-flex-shrink-0 tw-w-6 tw-h-6 tw-bg-gray-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-ml-3 tw-opacity-60"
                >
                  <q-icon
                    name="arrow_forward"
                    class="tw-text-gray-600 tw-text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Create New Option -->
            <div
              v-if="showCreateOption"
              class="tw-mx-2 tw-mt-2 tw-rounded-lg tw-cursor-pointer tw-transition-all tw-duration-200 tw-border-2 tw-border-dashed tw-border-blue-300 tw-bg-blue-50 hover:tw-bg-blue-100 hover:tw-border-blue-400"
              :class="{
                'tw-bg-blue-100 tw-border-blue-400 tw-shadow-sm':
                  highlightedIndex === filteredOptions.length,
              }"
              @click="createNewOption"
              @mouseenter="highlightedIndex = filteredOptions.length"
            >
              <div class="tw-flex tw-items-center tw-px-3 tw-py-3 tw-space-x-3">
                <div
                  class="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-bg-blue-200 tw-rounded-lg tw-flex tw-items-center tw-justify-center"
                >
                  <q-icon name="add" class="tw-text-blue-600 tw-text-lg" />
                </div>
                <div class="tw-flex-1">
                  <div class="tw-font-medium tw-text-sm tw-text-blue-700">
                    Buat opsi baru
                  </div>
                  <div class="tw-text-xs tw-text-blue-600 tw-mt-0.5">
                    "{{ searchQuery }}"
                  </div>
                </div>
                <div class="tw-flex-shrink-0">
                  <q-icon
                    name="keyboard_return"
                    class="tw-text-blue-500 tw-text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Backdrop -->
    <div v-if="isOpen" class="dropdown-backdrop" @click="closeDropdown"></div>
  </div>
</template>

<script setup>
import VsxIcon from "./VsxIcon.vue";
import { defineProps, defineEmits, computed, ref, watch, nextTick } from "vue";

const emit = defineEmits(["update:modelValue", "create"]);

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Pilih opsi...",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  dense: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  optionLabel: {
    type: [String, Function],
    default: "label",
  },
  optionValue: {
    type: [String, Function],
    default: "value",
  },
  optionIcon: {
    type: [String, Function],
    default: "icon",
  },
  emitValue: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: true, // Changed default to true
  },
  allowCreate: {
    type: Boolean,
    default: false,
  },
  maxValues: {
    type: Number,
    default: null,
  },
  prependIcon: {
    type: String,
    default: "",
  },
  useInlineSearch: {
    type: Boolean,
    default: true, // New prop for inline search
  },
  filterMethod: {
    type: Function,
    default: null, // Custom filter function
  },
  minSearchLength: {
    type: Number,
    default: 0, // Minimum characters before filtering
  },
});

// State
const isOpen = ref(false);
const searchQuery = ref("");
const highlightedIndex = ref(-1);
const inputRef = ref(null);
const optionsListRef = ref(null);
const tempInputValue = ref("");

// Computed
const computedRules = computed(() => {
  if (props.required) {
    const requiredRule = (val) => {
      if (props.multiple) {
        return (
          (Array.isArray(val) && val.length > 0) || "Field ini wajib diisi"
        );
      }
      return !!val || "Field ini wajib diisi";
    };
    return [requiredRule, ...props.rules];
  }
  return props.rules;
});

const hasValue = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0;
  }
  return !!props.modelValue;
});

const displayValue = computed(() => {
  // When dropdown is open and searchable with inline search, show search query
  if (isOpen.value && props.searchable && props.useInlineSearch) {
    return tempInputValue.value;
  }

  if (!props.modelValue) return "";

  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return "";
    if (props.modelValue.length === 1) {
      const option = findOptionByValue(props.modelValue[0]);
      return option ? getOptionLabel(option) : props.modelValue[0];
    }
    return `${props.modelValue.length} item dipilih`;
  }

  const option = findOptionByValue(props.modelValue);
  return option ? getOptionLabel(option) : props.modelValue;
});

const filteredOptions = computed(() => {
  if (!props.searchable || searchQuery.value.length < props.minSearchLength) {
    return props.options;
  }

  // Use custom filter method if provided
  if (props.filterMethod) {
    return props.filterMethod(props.options, searchQuery.value);
  }

  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.options;

  return props.options.filter((option) => {
    const label = getOptionLabel(option).toLowerCase();
    const description = option.description?.toLowerCase() || "";
    const searchTerms = query.split(" ").filter((term) => term.length > 0);

    // All search terms must match either label or description
    return searchTerms.every(
      (term) => label.includes(term) || description.includes(term)
    );
  });
});

const showCreateOption = computed(() => {
  return (
    props.allowCreate &&
    searchQuery.value &&
    searchQuery.value.length >= props.minSearchLength &&
    !filteredOptions.value.some(
      (opt) =>
        getOptionLabel(opt).toLowerCase() === searchQuery.value.toLowerCase()
    )
  );
});

// Methods
const getOptionLabel = (option) => {
  if (typeof props.optionLabel === "function") {
    return props.optionLabel(option);
  }
  if (typeof option === "object" && option !== null) {
    return option[props.optionLabel] || option.label || String(option);
  }
  return String(option);
};

const getOptionValue = (option) => {
  if (typeof props.optionValue === "function") {
    return props.optionValue(option);
  }
  if (typeof option === "object" && option !== null) {
    return option[props.optionValue] || option.value || option;
  }
  return option;
};

const getOptionIcon = (option) => {
  if (typeof props.optionIcon === "function") {
    return props.optionIcon(option);
  }
  if (typeof option === "object" && option !== null) {
    return option[props.optionIcon] || option.icon || "";
  }
  return "";
};

const findOptionByValue = (value) => {
  return props.options.find((option) => getOptionValue(option) === value);
};

const isSelected = (option) => {
  const optionValue = getOptionValue(option);
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(optionValue);
  }
  return props.modelValue === optionValue;
};

const highlightMatch = (text) => {
  if (!props.searchable || !searchQuery.value || !text) return text;

  const query = searchQuery.value.toLowerCase().trim();
  const searchTerms = query.split(" ").filter((term) => term.length > 0);

  let highlightedText = String(text);
  searchTerms.forEach((term) => {
    const regex = new RegExp(`(${term})`, "gi");
    highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
  });

  return highlightedText;
};

const handleInputClick = () => {
  if (!props.disable) {
    if (!isOpen.value) {
      openDropdown();
    }
  }
};

const handleInputFocus = () => {
  if (props.searchable && props.useInlineSearch && !isOpen.value) {
    openDropdown();
  }
};

const handleInputChange = (event) => {
  if (props.searchable && props.useInlineSearch && isOpen.value) {
    const value = event.target?.value || event;
    tempInputValue.value = value;
    searchQuery.value = value;
    highlightedIndex.value = -1;
  }
};

const handleSearchInput = () => {
  highlightedIndex.value = -1;
};

const toggleDropdown = () => {
  if (!props.disable) {
    if (isOpen.value) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }
};

const openDropdown = () => {
  isOpen.value = true;
  searchQuery.value = "";
  highlightedIndex.value = -1;

  if (props.searchable && props.useInlineSearch) {
    tempInputValue.value = "";
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = "";
  highlightedIndex.value = -1;
  tempInputValue.value = "";
};

const selectOption = (option) => {
  const optionValue = getOptionValue(option);

  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : [];
    const index = currentValues.indexOf(optionValue);

    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      if (!props.maxValues || currentValues.length < props.maxValues) {
        currentValues.push(optionValue);
      }
    }

    const newValue = props.emitValue
      ? currentValues
      : currentValues.map((val) => findOptionByValue(val));
    emit("update:modelValue", newValue);
  } else {
    const newValue = props.emitValue ? optionValue : option;
    emit("update:modelValue", newValue);
    closeDropdown();
  }
};

const selectHighlightedOption = () => {
  if (highlightedIndex.value >= 0) {
    if (highlightedIndex.value < filteredOptions.value.length) {
      selectOption(filteredOptions.value[highlightedIndex.value]);
    } else if (showCreateOption.value) {
      createNewOption();
    }
  }
};

const clearSelection = () => {
  const newValue = props.multiple ? [] : null;
  emit("update:modelValue", newValue);
};

const createNewOption = () => {
  const newOption = {
    label: searchQuery.value,
    value: searchQuery.value,
  };

  emit("create", newOption);

  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : [];
    currentValues.push(searchQuery.value);
    emit("update:modelValue", currentValues);
  } else {
    emit("update:modelValue", searchQuery.value);
    closeDropdown();
  }
};

const scrollToHighlighted = () => {
  nextTick(() => {
    if (optionsListRef.value && highlightedIndex.value >= 0) {
      const highlightedElement =
        optionsListRef.value.children[highlightedIndex.value];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  });
};

const handleKeydown = (event) => {
  if (!isOpen.value) {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      openDropdown();
    }
    return;
  }

  const totalOptions =
    filteredOptions.value.length + (showCreateOption.value ? 1 : 0);

  switch (event.key) {
    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;
    case "Enter":
      event.preventDefault();
      selectHighlightedOption();
      break;
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = (highlightedIndex.value + 1) % totalOptions;
      scrollToHighlighted();
      break;
    case "ArrowUp":
      event.preventDefault();
      highlightedIndex.value =
        highlightedIndex.value <= 0
          ? totalOptions - 1
          : highlightedIndex.value - 1;
      scrollToHighlighted();
      break;
    case "Tab":
      closeDropdown();
      break;
  }
};

// Watchers
watch(isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener("keydown", handleGlobalKeydown);
  } else {
    document.removeEventListener("keydown", handleGlobalKeydown);
  }
});

const handleGlobalKeydown = (event) => {
  if (event.key === "Escape" && isOpen.value) {
    closeDropdown();
  }
};

// Reset highlighted index when filtered options change
watch(filteredOptions, () => {
  highlightedIndex.value = -1;
});
</script>

<style scoped>
.elegant-select {
  position: relative;
  width: 100%;
}

.select-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.required-asterisk {
  color: #ef4444;
  margin-left: 2px;
}

.select-wrapper {
  position: relative;
}

.select-input {
  cursor: pointer;
}

.select-input :deep(.q-field__control) {
  cursor: pointer;
}

.prepend-icon {
  color: #6b7280;
  font-size: 18px;
}

.dropdown-arrow {
  color: #6b7280;
  font-size: 20px;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.dropdown-arrow--open {
  transform: rotate(180deg);
}

.options-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin-top: 4px;
  overflow: hidden;
}

.search-container {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.search-input {
  background: white;
  border-radius: 6px;
}

.search-icon tw-ml-5 {
  color: #9ca3af;
}

.options-list {
  max-height: 240px;
  overflow-y: auto;
}

.no-results {
  padding: 16px 12px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid #f9fafb;
}

.option-item:hover,
.option-item--highlighted {
  background-color: #f8fafc;
}

.option-item--selected {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.option-item:last-child {
  border-bottom: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.option-icon {
  color: #6b7280;
  font-size: 18px;
}

.option-item--selected .option-icon {
  color: #1d4ed8;
}

.option-text {
  flex: 1;
}

.option-label {
  font-weight: 500;
  font-size: 14px;
}

.option-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.selected-icon {
  color: #1d4ed8;
  font-size: 18px;
}

.create-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  color: #1d4ed8;
  font-weight: 500;
  border-top: 1px solid #e5e7eb;
  background: #fafafa;
  transition: background-color 0.15s ease;
}

.create-option:hover,
.create-option.option-item--highlighted {
  background-color: #eff6ff;
}

.create-icon {
  font-size: 18px;
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

/* Dropdown Animation */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* Custom Scrollbar */
.options-list::-webkit-scrollbar {
  width: 6px;
}

.options-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.options-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Highlight search matches */
:deep(mark) {
  background-color: #fef08a;
  color: #854d0e;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 600;
}

/* Line clamp utility */
.tw-line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
