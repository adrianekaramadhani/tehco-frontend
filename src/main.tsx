// File: src/main.tsx

import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Mengimpor semua file CSS yang dibutuhkan
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import './index.css' // File ini berisi gaya dasar Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Pastikan tidak ada tag <React.StrictMode> di sini
  <App />
)