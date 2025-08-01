// Global type declarations
declare module 'src/components/VsxIcon.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module './components/VsxIcon.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/VsxIcon.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'src/boot/axios' {
  import { AxiosInstance } from 'axios'
  const api: AxiosInstance
  export { api }
  export default api
}

declare module './boot/axios' {
  import { AxiosInstance } from 'axios'
  const api: AxiosInstance
  export { api }
  export default api
}

declare module '@/boot/axios' {
  import { AxiosInstance } from 'axios'
  const api: AxiosInstance
  export { api }
  export default api
}

// Extend global types for your project
declare global {
  // Add any global types here if needed
}

export {}