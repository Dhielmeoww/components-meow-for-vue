# Vue Quasar Components

A comprehensive Vue 3 component library built with Quasar Framework and TailwindCSS.

## Features

- 🚀 Vue 3 Composition API
- 📱 Responsive design with TailwindCSS
- 🎨 Beautiful UI components with Quasar
- 📦 Tree-shakable ESM modules
- 🔧 TypeScript support
- 🎯 Easy to use and customize

## Components

- **BaseDialog** - Modal dialog component
- **BaseInputText** - Enhanced text input with validation
- **BaseSelect** - Advanced select dropdown with search
- **BaseTable** - Feature-rich data table with filters, pagination, and server-side support
- **EssentialLink** - Navigation link component with submenu support
- **VsxIcon** - Icon component using vue-iconsax

## Installation

### NPM

```bash
npm install vue-quasar-components
```

### Yarn

```bash
yarn add vue-quasar-components
```

## Requirements

Make sure you have these peer dependencies installed:

```bash
npm install vue@^3.3.0 quasar@^2.12.0 vue-iconsax@^1.0.0
```

## Usage

### Global Registration

```javascript
import { createApp } from "vue";
import { Quasar } from "quasar";
import VueQuasarComponents from "vue-quasar-components";
import "vue-quasar-components/dist/style.css";

const app = createApp(App);

app.use(Quasar);
app.use(VueQuasarComponents);

app.mount("#app");
```

### Individual Component Import

```vue
<template>
  <div>
    <BaseInputText
      v-model="inputValue"
      label="Name"
      placeholder="Enter your name"
    />

    <BaseTable
      :columns="columns"
      :rows="data"
      title="Users Table"
      show-filters
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { BaseInputText, BaseTable } from "vue-quasar-components";

const inputValue = ref("");
const columns = [
  { name: "name", label: "Name", field: "name" },
  { name: "email", label: "Email", field: "email" },
];
const data = [{ name: "John Doe", email: "john@example.com" }];
</script>
```

## Components Documentation

### BaseDialog

Modal dialog component with customizable header, content, and footer.

```vue
<BaseDialog
  v-model="showDialog"
  title="Confirm Action"
  subtitle="Are you sure you want to proceed?"
  :show-close-button="true"
  @submit="handleSubmit"
>
  <template #content>
    <p>This action cannot be undone.</p>
  </template>
</BaseDialog>
```

### BaseInputText

Enhanced text input with validation and icon support.

```vue
<BaseInputText
  v-model="email"
  label="Email"
  type="email"
  placeholder="Enter your email"
  :rules="[(val) => !!val || 'Email is required']"
  prepend-icon="Mail"
  required
/>
```

### BaseSelect

Advanced select component with search functionality.

```vue
<BaseSelect
  v-model="selectedUser"
  :options="userOptions"
  label="Select User"
  searchable
  clearable
  placeholder="Choose a user..."
/>
```

### BaseTable

Feature-rich data table with server-side support.

```vue
<BaseTable
  v-model="tableData"
  :columns="tableColumns"
  title="User Management"
  :server-side="true"
  endpoint="/api/users"
  :show-filters="true"
  :show-add-button="true"
  @add-clicked="showAddDialog = true"
/>
```

## TailwindCSS Integration

This library uses TailwindCSS with the `tw-` prefix to avoid conflicts. Make sure to configure your TailwindCSS to include the component styles:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/vue-quasar-components/**/*.{vue,js,ts}",
  ],
  // ... other config
};
```

## Development

### Setup

```bash
git clone https://github.com/yourusername/vue-quasar-components.git
cd vue-quasar-components
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0

- Initial release
- BaseDialog component
- BaseInputText component
- BaseSelect component
- BaseTable component with server-side support
- EssentialLink component
- VsxIcon component
