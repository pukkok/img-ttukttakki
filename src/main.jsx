import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App'
import CropPage from './pages/CropPage'
import SplitPage from './pages/SplitPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='easy-crop'>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/crop" element={<CropPage />} />
      <Route path="/split" element={<SplitPage />} />
    </Routes>
  </BrowserRouter>
)
