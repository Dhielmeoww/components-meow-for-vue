import type { App } from 'vue'

// Import components
import BaseDialog from './components/BaseDialog.vue'
import BaseInputText from './components/BaseInputText.vue'
import BaseSelect from './components/BaseSelect.vue'
// import BaseTable from './components/BaseTable.vue' 
import EssentialLink from './components/EssentialLink.vue'
import VsxIcon from './components/VsxIcon.vue'

// Import styles
import './styles/index.css'

// Export individual components
export {
  BaseDialog,
  BaseInputText,
  BaseSelect,
//   BaseTable,
  EssentialLink,
  VsxIcon
}

// Plugin untuk install semua komponen
const VueQuasarComponents = {
  install(app: App) {
    app.component('BaseDialog', BaseDialog)
    app.component('BaseInputText', BaseInputText)
    app.component('BaseSelect', BaseSelect)
    // app.component('BaseTable', BaseTable)
    app.component('EssentialLink', EssentialLink)
    app.component('VsxIcon', VsxIcon)
  }
}

export default VueQuasarComponents

// Export types
export * from './types'