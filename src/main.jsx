import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App'
import CropPage from './pages/CropPage'
import SplitPage from './pages/SplitPage'
import './index.css'
import MergePage from './pages/MergePage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='img-ttukttakki'>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/crop" element={<CropPage />} />
      <Route path="/split" element={<SplitPage />} />
      <Route path="/merge" element={<MergePage />} />
    </Routes>
  </BrowserRouter>
)
