<template>
  <div class="tw-space-y-6">
    <!-- Page Header - Modern Minimalist -->
    <div
      v-if="showHeader"
      class="tw-bg-white tw-rounded-lg tw-shadow-xs tw-border tw-border-gray-100 tw-p-5"
    >
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <div>
          <h1
            class="tw-text-xl tw-font-semibold tw-text-gray-800 tw-flex tw-items-center tw-gap-2"
          >
            <div
              v-if="headerIcon"
              class="tw-w-8 tw-h-8 tw-bg-gradient-to-r tw-from-blue-400 tw-to-blue-500 tw-rounded-md tw-flex tw-items-center tw-justify-center"
            >
              <i :class="`fas fa-${headerIcon} tw-text-white tw-text-sm`"></i>
            </div>
            {{ title }}
          </h1>
          <p v-if="subtitle" class="tw-text-gray-500 tw-text-sm tw-mt-1">
            {{ subtitle }}
          </p>
        </div>

        <!-- Header Actions - Cleaner Design -->
        <div class="tw-flex tw-items-center tw-gap-2">
          <slot name="header-actions"></slot>

          <!-- Export Button - Subtle Design -->
          <q-btn
            v-if="showExportButton"
            @click="$emit('export-clicked')"
            icon="download"
            :label="exportButtonLabel"
            unelevated
            no-caps
            class="tw-bg-white tw-text-gray-700 tw-border tw-border-gray-200 hover:tw-bg-gray-50 tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-rounded-md"
          />

          <!-- Add Button - Primary Accent -->
          <q-btn
            v-if="showAddButton"
            @click="$emit('add-clicked')"
            icon="add"
            :label="addButtonLabel"
            unelevated
            no-caps
            class="tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600 tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-rounded-md"
          />
        </div>
      </div>

      <!-- Filters Section - Cleaner Layout -->
      <div v-if="showFilters" class="tw-space-y-3">
        <div
          :class="[
            'tw-grid tw-gap-3',
            filterOptions.length > 0
              ? 'tw-grid-cols-1 md:tw-grid-cols-3'
              : 'tw-grid-cols-1',
          ]"
        >
          <!-- Search Input - Minimalist -->
          <div
            :class="
              filterOptions.length > 0
                ? 'tw-col-span-1 md:tw-col-span-2'
                : 'tw-col-span-1'
            "
          >
            <q-input
              v-model="searchQuery"
              outlined
              dense
              :placeholder="searchPlaceholder"
              class="tw-w-full"
              @input="onSearchInput"
              debounce="500"
              @update:model-value="loadDataFromServer"
            >
              <template v-slot:prepend>
                <q-icon name="search" class="tw-text-gray-400" size="18px" />
              </template>
              <template v-slot:append v-if="searchQuery">
                <q-icon
                  name="close"
                  @click="clearSearch"
                  class="tw-cursor-pointer tw-text-gray-400 hover:tw-text-gray-600"
                  size="16px"
                />
              </template>
            </q-input>
          </div>

          <!-- Column Filter - Subtle Design -->
          <div class="tw-col-span-1" v-if="filterOptions.length > 0">
            <q-select
              v-model="selectedFilter"
              :options="filterOptions"
              outlined
              dense
              emit-value
              map-options
              label="Filter by column"
              @update:model-value="
                (val) => {
                  loadDataFromServer();
                }
              "
            >
              <template v-slot:prepend>
                <q-icon
                  name="filter_alt"
                  class="tw-text-gray-400"
                  size="18px"
                />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="selectedFilter !== 'all'"
                  name="close"
                  @click="clearColumnFilter"
                  class="tw-cursor-pointer tw-text-gray-400 hover:tw-text-gray-600"
                  size="16px"
                />
              </template>
            </q-select>
          </div>
        </div>

        <!-- Date Range Export - Card Design -->
        <div
          v-if="showDateRangeExport"
          class="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-border tw-border-gray-100"
        >
          <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
            <div
              class="tw-w-8 tw-h-8 tw-bg-blue-100 tw-rounded-md tw-flex tw-items-center tw-justify-center"
            >
              <q-icon name="event" class="tw-text-blue-500" size="18px" />
            </div>
            <div>
              <h3 class="tw-text-sm tw-font-medium tw-text-gray-700">
                Export Date Range
              </h3>
              <p class="tw-text-xs tw-text-gray-500">
                Select date range for export
              </p>
            </div>
          </div>

          <div
            class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-3 tw-items-end"
          >
            <!-- Start Date -->
            <div>
              <q-input
                v-model="exportDateRange.from"
                outlined
                dense
                label="Start Date"
                class="tw-w-full"
                readonly
                :rules="[(val) => !!val || 'Start date is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="tw-text-gray-400" size="18px">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="exportDateRange.from"
                        mask="YYYY-MM-DD"
                        today-btn
                        flat
                        color="blue"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- End Date -->
            <div>
              <q-input
                v-model="exportDateRange.to"
                outlined
                dense
                label="End Date"
                class="tw-w-full"
                readonly
                :rules="[(val) => !!val || 'End date is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="tw-text-gray-400" size="18px">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="exportDateRange.to"
                        mask="YYYY-MM-DD"
                        :options="
                          (date) =>
                            !exportDateRange.from ||
                            date >= exportDateRange.from
                        "
                        today-btn
                        flat
                        color="blue"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Export Button - Primary Accent -->
            <div>
              <q-btn
                @click="$emit('export-range-clicked', exportDateRange)"
                icon="download"
                label="Export"
                unelevated
                no-caps
                :disable="!exportDateRange.from || !exportDateRange.to"
                :loading="exportLoading"
                class="tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600 tw-w-full tw-px-3 tw-py-2 tw-text-xs tw-font-medium tw-rounded-md"
              />
            </div>

            <!-- Quick Date Presets - Subtle Dropdown -->
            <div>
              <q-btn-dropdown
                unelevated
                no-caps
                icon="schedule"
                label="Presets"
                class="tw-bg-white tw-text-gray-700 tw-border tw-border-gray-200 hover:tw-bg-gray-50 tw-w-full tw-px-3 tw-py-2 tw-text-xs tw-font-medium tw-rounded-md"
                dropdown-icon="expand_more"
              >
                <q-list dense class="tw-py-1">
                  <q-item
                    clickable
                    v-close-popup
                    @click="setDatePreset('today')"
                  >
                    <q-item-section class="tw-text-sm">Today</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="setDatePreset('week')"
                  >
                    <q-item-section class="tw-text-sm"
                      >Last 7 Days</q-item-section
                    >
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="setDatePreset('month')"
                  >
                    <q-item-section class="tw-text-sm"
                      >Last 30 Days</q-item-section
                    >
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="setDatePreset('quarter')"
                  >
                    <q-item-section class="tw-text-sm"
                      >Last 3 Months</q-item-section
                    >
                  </q-item>
                  <q-separator class="tw-my-1" />
                  <q-item clickable v-close-popup @click="clearDateRange()">
                    <q-item-section class="tw-text-sm tw-text-red-500"
                      >Reset</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters - Minimal Badges -->
      <div
        v-if="
          (searchQuery ||
            (selectedFilter !== 'all' && filterOptions.length > 0)) &&
          showFilters
        "
        class="tw-flex tw-items-center tw-gap-2 tw-mt-3"
      >
        <q-chip
          v-if="searchQuery"
          removable
          @remove="clearSearch"
          color="gray-100"
          text-color="gray-700"
          size="sm"
          class="tw-border tw-border-gray-200 tw-rounded-md"
        >
          Search: "{{ searchQuery }}"
        </q-chip>
        <q-chip
          v-if="selectedFilter !== 'all' && filterOptions.length > 0"
          removable
          @remove="clearColumnFilter"
          color="gray-100"
          text-color="gray-700"
          size="sm"
          class="tw-border tw-border-gray-200 tw-rounded-md"
        >
          {{ selectedFilter.label || selectedFilter }}
        </q-chip>
      </div>
      <div
        v-if="activeColumnFiltersDisplay.length > 0 && showFilters"
        class="tw-flex tw-items-center tw-gap-2 tw-mt-3"
      >
        <span class="tw-text-xs tw-text-gray-500 tw-font-medium"
          >Column Filters:</span
        >
        <q-chip
          v-for="filter in activeColumnFiltersDisplay"
          :key="filter.name"
          removable
          @remove="clearColumnFilter(filter.name)"
          color="blue-100"
          text-color="blue-700"
          size="sm"
          class="tw-border tw-border-blue-200 tw-rounded-md"
        >
          {{ filter.label }}: "{{ filter.value }}"
        </q-chip>
      </div>
    </div>

    <!-- Table - Modern Minimalist Design -->
    <div
      v-if="showTable"
      class="tw-bg-white tw-rounded-lg tw-shadow-xs tw-border tw-border-gray-100 tw-overflow-hidden"
    >
      <!-- Menu Table with Tree Structure -->
      <q-table
        v-if="isMenu"
        ref="tableRef"
        :rows="processedMenuData"
        :columns="tableColumns"
        :row-key="rowKey"
        v-model:pagination="pagination"
        :loading="loading"
        flat
        class="tw-w-full"
        :rows-per-page-options="rowsPerPageOptions"
        @request="onTableRequest"
        binary-state-sort
        :selection="selection"
        v-model:selected="selected"
        @update:selected="$emit('onSelect', selected)"
        :class="{
          'my-sticky-column-table': needSticky,
          '!tw-bg-white !tw-rounded-none': !withoutStyle,
        }"
      >
        <!-- Menu Table Header - Minimalist -->
        <template v-slot:header="props">
          <q-tr :props="props" class="tw-bg-gray-50">
            <q-th
              v-if="selection == 'multiple'"
              class="tw-text-gray-500 tw-font-medium tw-text-xs tw-py-3 tw-uppercase"
            >
              <q-checkbox v-model="props.selected" size="xs" />
            </q-th>
            <q-th
              v-else-if="selection == 'single'"
              class="tw-text-gray-500 tw-font-medium tw-text-xs tw-py-3 tw-uppercase"
            >
              #
            </q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="tw-text-gray-500 tw-font-medium tw-text-xs tw-py-3 tw-uppercase"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Menu Tree Row - Clean Design -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="hover:tw-bg-gray-50 tw-transition-colors tw-duration-150"
          >
            <!-- Selection column -->
            <q-td v-if="selection == 'multiple'" class="tw-py-3">
              <q-checkbox v-model="props.selected" size="xs" />
            </q-td>
            <q-td v-else-if="selection == 'single'" class="tw-py-3">
              <span class="tw-text-gray-500 tw-text-sm">
                {{ props.rowIndex + 1 }}
              </span>
            </q-td>

            <!-- Dynamic column rendering with tree structure -->
            <q-td
              v-for="col in tableColumns"
              :key="col.name"
              :props="props"
              class="tw-py-3"
            >
              <!-- Special handling for first column to show tree structure -->
              <div
                v-if="col.name === tableColumns[0].name"
                class="tw-flex tw-items-center tw-gap-2"
                :style="`margin-left: ${props.row.level * 16}px`"
              >
                <!-- Expand/Collapse button for parent items -->
                <q-btn
                  v-if="props.row.hasChildren"
                  :icon="props.row.expanded ? 'expand_less' : 'expand_more'"
                  flat
                  round
                  dense
                  size="sm"
                  @click="toggleMenuExpansion(props.row)"
                  class="tw-text-gray-400 hover:tw-text-gray-600"
                />
                <!-- Spacer for child items -->
                <div v-else class="tw-w-6"></div>

                <!-- Custom slot for menu name column -->
                <slot
                  :name="`cell-${col.name}`"
                  :row="props.row"
                  :value="props.row[col.field]"
                  :column="col"
                >
                  <slot :name="col.name" v-bind="props">
                    <!-- Default menu name rendering -->
                    <span
                      :class="{
                        'tw-font-medium tw-text-gray-800':
                          props.row.level === 0,
                        'tw-text-gray-600': props.row.level > 0,
                      }"
                      class="tw-text-sm"
                    >
                      {{ props.row[col.field] }}
                    </span>
                  </slot>
                </slot>
              </div>
              <!-- Regular column rendering for other columns -->
              <div v-else>
                <slot
                  :name="`cell-${col.name}`"
                  :row="props.row"
                  :value="props.row[col.field]"
                  :column="col"
                >
                  <slot :name="col.name" v-bind="props">
                    <!-- Default rendering based on column type -->
                    <component
                      :is="getCellComponent(col, props.row)"
                      v-bind="getCellProps(col, props.row)"
                    />
                  </slot>
                </slot>
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- Loading State - Subtle Indicator -->
        <template v-slot:loading>
          <q-inner-loading showing color="blue-400" size="sm" />
        </template>

        <!-- No Data State - Minimalist Design -->
        <template v-slot:no-data="{ message }">
          <slot name="no-data">
            <div class="tw-w-full tw-py-10 tw-text-center">
              <div
                class="tw-w-12 tw-h-12 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3"
              >
                <i
                  :class="`fas fa-${noDataIcon} tw-text-gray-400 tw-text-xl`"
                ></i>
              </div>
              <h3 class="tw-text-base tw-font-medium tw-text-gray-700 tw-mb-1">
                {{ noDataTitle }}
              </h3>
              <p class="tw-text-gray-500 tw-text-sm">
                {{ message || noDataMessage }}
              </p>
            </div>
          </slot>
        </template>
      </q-table>

      <!-- Regular Table (Non-Menu) - Modern Design -->
      <q-table
        v-else
        ref="tableRef"
        :rows="processedData"
        :columns="tableColumns"
        :row-key="rowKey"
        v-model:pagination="pagination"
        :loading="loading"
        flat
        class="tw-w-full"
        :rows-per-page-options="rowsPerPageOptions"
        @request="onTableRequest"
        binary-state-sort
        :selection="selection"
        v-model:selected="selected"
        :hide-pagination="isHidePagination"
        @update:selected="$emit('onSelect', selected)"
        :class="{
          'my-sticky-column-table': needSticky,
          '!tw-bg-white !tw-rounded-none': !withoutStyle,
        }"
      >
        <!-- Table Header - Minimalist -->
        <template v-slot:header="props">
          <q-tr :props="props" class="tw-bg-gray-50">
            <q-th
              v-if="selection == 'multiple'"
              class="tw-text-gray-500 tw-font-medium tw-text-xs tw-py-3 tw-uppercase"
            >
              <q-checkbox v-model="props.selected" size="xs" />
            </q-th>
            <q-th
              v-else-if="selection == 'single'"
              class="tw-text-gray-500 tw-font-medium tw-text-xs tw-py-3 tw-uppercase"
            >
              #
            </q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="tw-text-gray-500 tw-font-medium tw-text-xs tw-py-3 tw-uppercase"
            >
              <!-- UBAH: Simplified Header Content Container -->
              <div class="tw-flex tw-items-center tw-justify-between tw-gap-2">
                <span class="tw-truncate tw-flex-1">{{ col.label }}</span>

                <!-- UBAH: Filter Button dengan dialog trigger -->
                <div class="tw-flex tw-items-center tw-gap-1 tw-flex-shrink-0">
                  <q-btn
                    v-if="col.filter_key"
                    :icon="
                      activeColumnFilters[col.name] &&
                      isValidFilterValue(columnFilterValues[col.name])
                        ? 'filter_alt'
                        : 'filter_alt_off'
                    "
                    flat
                    round
                    dense
                    size="xs"
                    :color="
                      activeColumnFilters[col.name] &&
                      isValidFilterValue(columnFilterValues[col.name])
                        ? 'blue'
                        : 'grey'
                    "
                    @click="toggleColumnFilterDialog(col, $event)"
                    class="tw-transition-colors"
                  >
                    <q-tooltip
                      class="bg-grey-8"
                      anchor="top middle"
                      self="bottom middle"
                    >
                      {{
                        activeColumnFilters[col.name] &&
                        isValidFilterValue(columnFilterValues[col.name])
                          ? "Edit Filter"
                          : "Add Filter"
                      }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>

              <!-- HAPUS: Filter Input/Dropdown inline yang lama -->
            </q-th>
          </q-tr>
        </template>

        <!-- Table Rows - Clean Design -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="hover:tw-bg-gray-50 tw-transition-colors tw-duration-150"
          >
            <!-- Selection column -->
            <q-td v-if="selection == 'multiple'" class="tw-py-3">
              <q-checkbox v-model="props.selected" size="xs" />
            </q-td>
            <q-td v-else-if="selection == 'single'" class="tw-py-3">
              <span class="tw-text-gray-500 tw-text-sm">
                {{ props.rowIndex + 1 }}
              </span>
            </q-td>

            <!-- Dynamic column rendering -->
            <q-td
              v-for="col in tableColumns"
              :key="col.name"
              :props="props"
              class="tw-py-3"
            >
              <slot
                :name="`cell-${col.name}`"
                :row="props.row"
                :value="props.row[col.field]"
                :column="col"
              >
                <slot :name="col.name" v-bind="props">
                  <component
                    :is="getCellComponent(col, props.row)"
                    v-bind="getCellProps(col, props.row)"
                  />
                </slot>
              </slot>
            </q-td>
          </q-tr>
        </template>

        <!-- Loading State - Subtle Indicator -->
        <template v-slot:loading>
          <q-inner-loading showing color="blue-400" size="sm" />
        </template>

        <!-- No Data State - Minimalist Design -->
        <template v-slot:no-data="{ message }">
          <slot name="no-data">
            <div class="tw-w-full tw-py-10 tw-text-center">
              <div
                class="tw-w-12 tw-h-12 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-3"
              >
                <i
                  :class="`fas fa-${noDataIcon} tw-text-gray-400 tw-text-xl`"
                ></i>
              </div>
              <h3 class="tw-text-base tw-font-medium tw-text-gray-700 tw-mb-1">
                {{ noDataTitle }}
              </h3>
              <p class="tw-text-gray-500 tw-text-sm">
                {{ message || noDataMessage }}
              </p>
            </div>
          </slot>
        </template>
      </q-table>
    </div>
    <q-dialog
      v-model="columnFilterDialog.show"
      position="right"
      @hide="closeColumnFilterDialog"
    >
      <q-card
        class="tw-w-80 tw-max-w-sm tw-max-h-96 tw-overflow-visible"
        :style="`
          position: fixed; 
          top: ${columnFilterDialog.position.y}px; 
          left: ${columnFilterDialog.position.x}px;
          z-index: 9999;
        `"
      >
        <!-- Dialog Header -->
        <q-card-section
          class="tw-bg-blue-50 tw-border-b tw-border-blue-100 tw-py-3"
        >
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-2">
              <q-icon name="filter_alt" class="tw-text-blue-500" size="18px" />
              <h6 class="tw-text-sm tw-font-medium tw-text-blue-700 tw-m-0">
                Filter: {{ columnFilterDialog.column?.label }}
              </h6>
            </div>
            <q-btn
              icon="close"
              flat
              round
              dense
              size="sm"
              @click="closeColumnFilterDialog"
              class="tw-text-blue-400 hover:tw-text-blue-600"
            />
          </div>
        </q-card-section>

        <!-- Dialog Content -->
        <q-card-section class="tw-py-4 tw-overflow-visible">
          <div class="tw-space-y-4">
            <!-- Text Filter -->
            <div v-if="columnFilterDialog.column?.filter_key === 'text'">
              <label
                class="tw-block tw-text-xs tw-font-medium tw-text-gray-700 tw-mb-2"
              >
                Search Value
              </label>
              <BaseInputText
                v-model="columnFilterValues[columnFilterDialog.column?.name]"
                :placeholder="`Filter ${columnFilterDialog.column?.label}...`"
                dense
                outlined
                class="tw-w-full"
                @keyup.enter="
                  applyColumnFilter(columnFilterDialog.column?.name)
                "
              >
                <template v-slot:prepend>
                  <q-icon name="search" size="sm" class="tw-text-gray-400" />
                </template>
                <template
                  v-slot:append
                  v-if="columnFilterValues[columnFilterDialog.column?.name]"
                >
                  <q-icon
                    name="close"
                    size="sm"
                    class="tw-cursor-pointer tw-text-gray-400 hover:tw-text-gray-600"
                    @click="
                      columnFilterValues[columnFilterDialog.column?.name] = ''
                    "
                  />
                </template>
              </BaseInputText>
            </div>

            <!-- Dropdown Filter -->
            <div
              v-else-if="columnFilterDialog.column?.filter_key === 'dropdown'"
              class="tw-h-96"
            >
              <label
                class="tw-block tw-text-xs tw-font-medium tw-text-gray-700 tw-mb-2"
              >
                Select Option
              </label>
              <div class="tw-relative">
                <BaseSelect
                  v-model="columnFilterValues[columnFilterDialog.column?.name]"
                  :options="columnFilterDialog.column?.dropdown_data || []"
                  :placeholder="`Pilih ${columnFilterDialog.column?.label}...`"
                  searchable
                  :use-inline-search="false"
                  dense
                  outlined
                  class="tw-w-full filter-dialog-select"
                  menu-anchor="bottom left"
                  menu-self="top left"
                  :menu-offset="[0, 8]"
                />
              </div>
            </div>

            <!-- Filter Actions -->
            <div
              class="tw-flex tw-items-center tw-justify-between tw-pt-2 tw-border-t tw-border-gray-100"
            >
              <q-btn
                v-if="
                  activeColumnFilters[columnFilterDialog.column?.name] &&
                  isValidFilterValue(
                    columnFilterValues[columnFilterDialog.column?.name]
                  )
                "
                label="Clear Filter"
                icon="clear"
                flat
                size="sm"
                color="red"
                @click="
                  clearColumnFilterFromDialog(columnFilterDialog.column?.name)
                "
                class="tw-text-xs"
              />
              <div class="tw-flex tw-gap-2 tw-ml-auto">
                <q-btn
                  label="Cancel"
                  flat
                  size="sm"
                  color="grey"
                  @click="closeColumnFilterDialog"
                  class="tw-text-xs"
                />
                <q-btn
                  label="Apply"
                  unelevated
                  size="sm"
                  color="blue"
                  @click="applyColumnFilter(columnFilterDialog.column?.name)"
                  :disable="
                    !isValidFilterValue(
                      columnFilterValues[columnFilterDialog.column?.name]
                    )
                  "
                  class="tw-text-xs"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import BaseInputText from "./BaseInputText.vue";
import BaseSelect from "./BaseSelect.vue";

// Props
const props = defineProps({
  // Data source props
  modelValue: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  endpoint: {
    type: String,
    default: "",
  },
  apiUrl: {
    type: String,
    default: "",
  },

  // Table configuration
  columns: {
    type: Array,
    required: true,
  },
  rowKey: {
    type: String,
    default: "id",
  },
  keyName: {
    type: String,
    default: "id",
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 15, 25, 50, 75, 100],
  },

  // Header configuration
  showHeader: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Data Table",
  },
  subtitle: {
    type: String,
    default: "",
  },
  headerIcon: {
    type: String,
    default: "table",
  },

  // Add button configuration
  showAddButton: {
    type: Boolean,
    default: true,
  },
  addButtonLabel: {
    type: String,
    default: "Tambah Data",
  },

  // Filter configuration
  showFilters: {
    type: Boolean,
    default: true,
  },
  searchPlaceholder: {
    type: String,
    default: "Cari data...",
  },
  searchFields: {
    type: Array,
    default: () => [],
  },
  filterOptions: {
    type: Array,
    default: () => [
      // { label: "Semua Data", value: "all" }
    ],
  },

  // No data configuration
  noDataIcon: {
    type: String,
    default: "folder-open",
  },
  noDataTitle: {
    type: String,
    default: "Tidak ada data",
  },
  noDataMessage: {
    type: String,
    default:
      "Belum ada data yang ditambahkan atau sesuai dengan filter yang dipilih.",
  },

  // Advanced configuration
  serverSide: {
    type: Boolean,
    default: false,
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },

  // Selection
  selection: {
    type: String,
    default: undefined,
  },

  // Styling
  needSticky: {
    type: Boolean,
    default: false,
  },
  withoutStyle: {
    type: Boolean,
    default: false,
  },
  isDense: {
    type: Boolean,
    default: false,
  },
  isHidePagination: {
    type: Boolean,
    default: false,
  },

  // Search
  search: {
    type: String,
    default: "",
  },

  // Loading
  isLoading: {
    type: Boolean,
    default: false,
  },

  // API Configuration
  fromApi: {
    type: String,
    default: "",
  },
  apiVersion: {
    type: String,
    default: "v1",
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  sortingFieldBy: {
    type: String,
    default: "",
  },

  // Static pagination for client-side
  paginationStatic: {
    type: Object,
    default: () => ({
      rowsPerPage: 10,
    }),
  },

  // NEW: Menu props
  isMenu: {
    type: Boolean,
    default: false,
  },
  parentIdField: {
    type: String,
    default: "parent_id",
  },
  nameField: {
    type: String,
    default: "nama_menu",
  },
  iconField: {
    type: String,
    default: "icon",
  },
  showExportButton: {
    type: Boolean,
    default: false,
  },
  exportButtonLabel: {
    type: String,
    default: "Export",
  },
  showDateRangeExport: {
    type: Boolean,
    default: false,
  },
  exportDateRange: {
    type: Object,
    default: () => ({
      from: "",
      to: "",
    }),
  },

  //show table
  showTable: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "add-clicked",
  "edit-clicked",
  "delete-clicked",
  "action-clicked",
  "search",
  "filter-changed",
  "request",
  "onSelect",
  "selected",
  "menu-expanded",
  "menu-collapsed",
]);

// Reactive state
const loading = ref(false);
const searchQuery = ref("");
const selectedFilter = ref("all");
const localData = ref([]);
const selected = ref([]);
const tableRef = ref();
const isTableFetched = ref(false);
const expandedMenus = ref(new Set());
const activeColumnFilters = ref({}); // Track filter aktif per column
const columnFilterValues = ref({}); // Track nilai filter per column

const pagination = ref({
  sortBy: props.sortingFieldBy ? "desc" : null,
  descending: false,
  page: 1,
  rowsPerPage: props.isMenu ? 0 : 10, // Show all for menu
  rowsNumber: 0,
});

// Computed properties
const tableColumns = computed(() => {
  return props.columns.map((col) => ({
    name: col.name,
    label: col.label,
    field: col.field || col.name,
    align: col.align || "left",
    sortable: col.sortable ?? false,
    format: col.format,
    type: col.type || "text",
    ...col,
  }));
});

const dataSource = computed(() => {
  if (props.serverSide) {
    return localData.value;
  }
  if (props.endpoint || props.apiUrl) {
    return localData.value;
  }
  return props.modelValue || props.rows || [];
});

// Build menu tree structure
const buildMenuTree = (items) => {
  const itemMap = {};
  const rootItems = [];
  const result = [];

  // Create a map of all items
  items.forEach((item) => {
    itemMap[item[props.rowKey]] = {
      ...item,
      children: [],
      level: 0,
      hasChildren: false,
      expanded: expandedMenus.value.has(item[props.rowKey]),
    };
  });

  // Build parent-child relationships
  items.forEach((item) => {
    const parentId = item[props.parentIdField];
    if (parentId && parentId !== 0 && itemMap[parentId]) {
      itemMap[parentId].children.push(itemMap[item[props.rowKey]]);
      itemMap[parentId].hasChildren = true;
      itemMap[item[props.rowKey]].level = itemMap[parentId].level + 1;
    } else {
      rootItems.push(itemMap[item[props.rowKey]]);
    }
  });

  // Flatten tree for display
  const flattenTree = (nodes, level = 0) => {
    const flattened = [];
    nodes.forEach((node) => {
      node.level = level;
      flattened.push(node);

      if (node.hasChildren && node.expanded) {
        flattened.push(...flattenTree(node.children, level + 1));
      }
    });
    return flattened;
  };

  return flattenTree(rootItems);
};

const processedMenuData = computed(() => {
  if (!props.isMenu) return [];
  return buildMenuTree(dataSource.value);
});

const processedData = computed(() => {
  if (props.isMenu) {
    return processedMenuData.value;
  }

  let data = [...dataSource.value];

  // Client-side processing only for non-server-side and non-API tables
  if (!props.serverSide && !props.endpoint && !props.apiUrl) {
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const searchFields =
        props.searchFields.length > 0
          ? props.searchFields
          : tableColumns.value.map((col) => col.field);

      data = data.filter((item) => {
        return searchFields.some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(query);
        });
      });
    }

    // Apply column filters
    if (selectedFilter.value !== "all") {
      emit("filter-changed", selectedFilter.value, data);
    }
  }

  return data;
});

// Check if table should use API
const shouldUseApi = computed(() => {
  return props.serverSide || props.endpoint || props.apiUrl;
});

// Menu methods
const toggleMenuExpansion = (menuItem) => {
  const menuId = menuItem[props.rowKey];

  if (expandedMenus.value.has(menuId)) {
    expandedMenus.value.delete(menuId);
    emit("menu-collapsed", menuItem);
  } else {
    expandedMenus.value.add(menuId);
    emit("menu-expanded", menuItem);
  }
};

// Methods
const onTableRequest = async (requestProps) => {
  // Prevent multiple simultaneous requests
  if (isTableFetched.value) return;

  isTableFetched.value = true;

  // Update pagination state
  pagination.value = {
    ...pagination.value,
    ...requestProps.pagination,
  };

  if (shouldUseApi.value) {
    await loadDataFromServer(requestProps);
  }

  emit("request", requestProps);
  isTableFetched.value = false;
};

const loadDataFromServer = async (requestProps = {}) => {
  const url = props.endpoint || props.apiUrl;
  if (!url) return;

  loading.value = true;

  try {
    const { page, rowsPerPage, sortBy, descending } =
      requestProps.pagination || pagination.value;

    // Prepare parameters
    const params = new URLSearchParams();

    // For menus, we usually want all data
    if (!props.isMenu) {
      // Pagination parameters
      params.append("page", (page - 1).toString()); // Zero-indexed for backend
      params.append("size", rowsPerPage.toString());
    } else {
      // For menu, get all data
      params.append("page", "0");
      params.append("size", "-1");
    }

    // Sorting
    if (sortBy || props.sortingFieldBy) {
      let sortField = sortBy || props.sortingFieldBy;
      let sortOrder = descending ? "desc" : "asc";

      if (props.sortingFieldBy && sortBy === "desc") {
        sortField = props.sortingFieldBy;
        sortOrder = "desc";
      }

      params.append("sort", `${sortField}`);
    }

    Object.keys(columnFilterValues.value).forEach((columnName) => {
      const filterValue = columnFilterValues.value[columnName];
      if (filterValue && activeColumnFilters.value[columnName]) {
        // Kirim filter dengan nama column sebagai key
        params.append(columnName, filterValue);
      }
    });

    // Search
    if (searchQuery.value) {
      params.append("search", searchQuery.value);
    }

    // Filters
    if (selectedFilter.value !== "all") {
      params.append("sort", selectedFilter.value?.field);
    }

    // Additional params
    if (props.params) {
      Object.keys(props.params).forEach((key) => {
        const value = props.params[key];
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item));
        } else if (value !== null && value !== undefined && value !== "") {
          params.append(key, value);
        }
      });
    }

    // Make API call based on version or source
    let response;
    if (props.fromApi) {
      // Handle different API sources if needed
      response = await api.get(url, { params });
    } else {
      response = await api.get(url, { params });
    }

    // Handle different response structures
    let items = [];
    let total = 0;

    if (response.data) {
      if (response.data.data) {
        if (response.data.data.items) {
          // Laravel-style pagination response
          items = response.data.data.items;
          total = response.data.data.total || response.data.data.items.length;
        } else if (Array.isArray(response.data.data)) {
          // Simple data array in data property
          items = response.data.data;
          total = response.data.total || response.data.count || items.length;
        }
      } else if (Array.isArray(response.data)) {
        // Direct array response
        items = response.data;
        total = items.length;
      } else if (response.data.items) {
        // Items directly in response
        items = response.data.items;
        total = response.data.total || response.data.count || items.length;
      }
    }

    localData.value = items;
    pagination.value.rowsNumber = total;

    emit("update:modelValue", localData.value);
  } catch (error) {
    console.error("Error loading data:", error);
    localData.value = [];
    pagination.value.rowsNumber = 0;
  } finally {
    loading.value = false;
  }
};

const onSearchInput = () => {
  // Reset to first page when searching
  pagination.value.page = 1;

  // For API-based tables (server-side or with endpoint/apiUrl)
  if (shouldUseApi.value) {
    // Trigger server request
    if (tableRef.value) {
      tableRef.value.requestServerInteraction();
    } else {
      // Fallback: directly call loadDataFromServer
      loadDataFromServer();
    }
  }

  // Always emit search event for parent components
  emit("search", searchQuery.value);
};

const onFilterChange = () => {
  // Reset to first page when filtering
  pagination.value.page = 1;

  // For API-based tables (server-side or with endpoint/apiUrl)
  if (shouldUseApi.value) {
    // Trigger server request
    if (tableRef.value) {
      tableRef.value.requestServerInteraction();
    } else {
      // Fallback: directly call loadDataFromServer
      loadDataFromServer();
    }
  }

  // Always emit filter change event
  emit("filter-changed", selectedFilter.value);
};

const clearSearch = () => {
  searchQuery.value = "";
  onSearchInput();
};

const clearColumnFilter = () => {
  console.log("Clearing column filter");

  selectedFilter.value = "all";
  onFilterChange();
};

// Cell rendering methods
const getCellComponent = (column, row) => {
  const value = row[column.field];

  switch (column.type) {
    case "badge":
    case "chip":
      return "q-chip";
    case "button":
      return "q-btn";
    case "icon":
      return "q-icon";
    case "avatar":
      return "q-avatar";
    case "actions":
      return "div";
    default:
      return "span";
  }
};

const getCellProps = (column, row) => {
  const value = row[column.field];

  switch (column.type) {
    case "badge":
    case "chip":
      return {
        color:
          column.color ||
          (typeof column.getColor === "function"
            ? column.getColor(value, row)
            : "primary"),
        "text-color": column.textColor || "white",
        size: column.size || "sm",
        icon:
          column.icon ||
          (typeof column.getIcon === "function"
            ? column.getIcon(value, row)
            : undefined),
        label: column.format ? column.format(value, row) : value,
      };
    case "button":
      return {
        color: column.color || "primary",
        size: column.size || "sm",
        icon: column.icon,
        label: column.format ? column.format(value, row) : value,
        flat: column.flat !== false,
        round: column.round,
        onClick: () => emit("action-clicked", column.action || "click", row),
      };
    case "icon":
      return {
        name: column.format ? column.format(value, row) : value,
        color: column.color,
        size: column.size,
      };
    case "avatar":
      return {
        src: value,
        size: column.size || "md",
        icon: column.icon || "person",
      };
    case "actions":
      return {
        class: "tw-flex tw-items-center tw-gap-2",
      };
    default:
      const formattedValue = column.format ? column.format(value, row) : value;
      return {
        class: column.class || "",
        innerHTML: formattedValue,
      };
  }
};

// Refresh method
const refresh = () => {
  if (shouldUseApi.value) {
    if (tableRef.value) {
      tableRef.value.requestServerInteraction();
    } else {
      loadDataFromServer();
    }
  }
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Date preset methods
const setDatePreset = (preset) => {
  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  switch (preset) {
    case "today":
      exportDateRange.value.from = formatDate(today);
      exportDateRange.value.to = formatDate(today);
      break;
    case "week":
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      exportDateRange.value.from = formatDate(weekAgo);
      exportDateRange.value.to = formatDate(today);
      break;
    case "month":
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      exportDateRange.value.from = formatDate(monthAgo);
      exportDateRange.value.to = formatDate(today);
      break;
    case "quarter":
      const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      exportDateRange.value.from = formatDate(quarterAgo);
      exportDateRange.value.to = formatDate(today);
      break;
  }
};

const clearDateRange = () => {
  exportDateRange.value.from = "";
  exportDateRange.value.to = "";
};

const toggleColumnFilter = (column) => {
  const colName = column.name;
  if (activeColumnFilters.value[colName]) {
    // Jika sudah aktif, nonaktifkan dan clear filter
    activeColumnFilters.value[colName] = false;
    // clearColumnFilter(colName);
  } else {
    // Aktifkan filter
    activeColumnFilters.value[colName] = true;
    // Initialize filter value jika belum ada
    if (!(colName in columnFilterValues.value)) {
      columnFilterValues.value[colName] = "";
    }
  }
};

const onColumnFilterChange = (columnName) => {
  // Reset ke halaman pertama saat filter berubah
  pagination.value.page = 1;

  // Trigger reload data
  if (shouldUseApi.value) {
    if (tableRef.value) {
      tableRef.value.requestServerInteraction();
    } else {
      loadDataFromServer();
    }
  }
};

const activeColumnFiltersDisplay = computed(() => {
  const activeFilters = [];
  Object.keys(columnFilterValues.value).forEach((columnName) => {
    const filterValue = columnFilterValues.value[columnName];
    if (filterValue && activeColumnFilters.value[columnName]) {
      const column = tableColumns.value.find((col) => col.name === columnName);
      activeFilters.push({
        name: columnName,
        label: column?.label || columnName,
        value: filterValue,
        type: column?.filter_key || "text",
      });
    }
  });
  return activeFilters;
});

const columnFilterDialog = ref({
  show: false,
  column: null,
  position: { x: 0, y: 0 },
});

// TAMBAH: Method untuk toggle dialog filter
const toggleColumnFilterDialog = (column, event) => {
  if (
    columnFilterDialog.value.show &&
    columnFilterDialog.value.column?.name === column.name
  ) {
    // Jika dialog sudah terbuka untuk column yang sama, tutup
    columnFilterDialog.value.show = false;
    columnFilterDialog.value.column = null;
  } else {
    // Buka dialog untuk column baru
    const rect = event.currentTarget.getBoundingClientRect();
    console.log(rect);

    // Position dialog below the header column
    columnFilterDialog.value.position = {
      x: rect.left + 8, // Align with left edge of button
      y: rect.top + 8, // 8px below the button
    };

    // Ensure dialog doesn't go off-screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dialogWidth = 320; // tw-w-80 = 320px
    const dialogHeight = 300; // Estimated dialog height

    // Adjust horizontal position if dialog would go off-screen
    if (columnFilterDialog.value.position.x + dialogWidth > viewportWidth) {
      columnFilterDialog.value.position.x = rect.right - dialogWidth;
    }

    // Adjust vertical position if dialog would go off-screen
    if (columnFilterDialog.value.position.y + dialogHeight > viewportHeight) {
      columnFilterDialog.value.position.y = rect.top - dialogHeight - 8; // Show above instead
    }

    columnFilterDialog.value.column = column;
    columnFilterDialog.value.show = true;

    // Initialize filter value jika belum ada
    if (!(column.name in columnFilterValues.value)) {
      columnFilterValues.value[column.name] = "";
    }
  }
};

// TAMBAH: Method untuk menutup dialog
const closeColumnFilterDialog = () => {
  columnFilterDialog.value.show = false;
  columnFilterDialog.value.column = null;
};

// TAMBAH: Method untuk apply filter dari dialog
const applyColumnFilter = (columnName) => {
  const filterValue = columnFilterValues.value[columnName];

  if (isValidFilterValue(filterValue)) {
    // Mark filter as active
    activeColumnFilters.value[columnName] = true;
    // Apply the filter
    onColumnFilterChange(columnName);
  } else {
    // If no value, remove the filter
    activeColumnFilters.value[columnName] = false;
  }

  closeColumnFilterDialog();
};

// TAMBAH: Method untuk clear filter dari dialog
const clearColumnFilterFromDialog = (columnName) => {
  columnFilterValues.value[columnName] = "";
  activeColumnFilters.value[columnName] = false;
  onColumnFilterChange(columnName);
  closeColumnFilterDialog();
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (!shouldUseApi.value && newValue) {
      localData.value = [...newValue];
      pagination.value.rowsNumber = newValue.length;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.rows,
  (newValue) => {
    if (!shouldUseApi.value && newValue) {
      localData.value = [...newValue];
      pagination.value.rowsNumber = newValue.length;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.search,
  (newValue) => {
    if (newValue !== searchQuery.value) {
      searchQuery.value = newValue;
      onSearchInput();
    }
  }
);

watch(
  selected,
  (newSelected) => {
    emit("selected", newSelected);
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  // Initialize search query from props
  if (props.search) {
    searchQuery.value = props.search;
  }

  if (shouldUseApi.value && props.autoLoad) {
    if (tableRef.value) {
      tableRef.value.requestServerInteraction();
    } else {
      // Use setTimeout to ensure table is mounted
      setTimeout(() => {
        loadDataFromServer();
      }, 100);
    }
  } else if (!shouldUseApi.value) {
    if (props.modelValue) {
      localData.value = [...props.modelValue];
      pagination.value.rowsNumber = props.modelValue.length;
    } else if (props.rows) {
      localData.value = [...props.rows];
      pagination.value.rowsNumber = props.rows.length;
    }
  }

  if (props.isMenu) {
    // Initialize expanded menus
    if (props.rows && props.rows.length > 0) {
      props.rows.forEach((item) => {
        if (item[props.parentIdField] === 0) {
          expandedMenus.value.add(item[props.rowKey]);
        }
      });
    }
  }
});

const isValidFilterValue = (value) => {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    return value.trim() !== "";
  } else if (typeof value === "object" && value !== null) {
    // For dropdown with object values
    return (
      value.value !== null && value.value !== undefined && value.value !== ""
    );
  } else {
    // For primitive values (number, boolean, etc)
    return value !== "" && value !== 0;
  }
};

// Expose methods and properties
defineExpose({
  loadData: loadDataFromServer,
  clearSearch,
  clearColumnFilter,
  refresh,
  selected,
  loading,
  tableRef,
  pagination,
});
</script>

<style scoped>
/* Custom table styling */
:deep(.q-table__top) {
  padding: 16px;
  background: #f8fafc;
}

:deep(.q-table thead tr) {
  background: #f1f5f9;
}

:deep(.q-table tbody td) {
  border-bottom: 1px solid #f3f4f6;
}

:deep(.q-table tbody tr:hover) {
  background-color: #f8fafc;
}

/* Button hover effects */
:deep(.q-btn--flat:hover) {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Form input styling */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-field--outlined.q-field--focused .q-field__control) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Sticky column styling */
.my-sticky-column-table :deep(th:nth-child(2)) {
  position: sticky;
  left: 0;
  z-index: 1;
}

.my-sticky-column-table td:nth-child(2) {
  position: sticky;
  left: 0;
  z-index: 50;
}

/* Input box styling */
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__marginal) {
  height: 36px;
}

/* HAPUS: Styling untuk filter inline yang sudah tidak dipakai */

/* Dialog positioning */
:deep(.q-dialog__inner) {
  pointer-events: none;
}

:deep(.q-dialog__inner > *) {
  pointer-events: auto;
}

/* Filter dialog styling */
:deep(.q-card) {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

/* Ensure dropdown in dialog has proper z-index */
:deep(.q-select__dropdown) {
  z-index: 10000 !important;
}

:deep(.q-menu) {
  z-index: 10000 !important;
}

/* Allow dialog content to overflow for dropdown */
:deep(.q-dialog .q-card) {
  overflow: visible !important;
}

:deep(.q-card-section) {
  overflow: visible !important;
}

/* Specific styling for BaseSelect dropdown in dialog */
:deep(.filter-dialog-select .q-field__control) {
  position: relative;
  z-index: 1;
}

:deep(.filter-dialog-select .q-menu) {
  z-index: 10001 !important;
  max-height: 200px;
  overflow-y: auto;
}
</style>
