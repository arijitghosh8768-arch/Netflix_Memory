import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import Loading from './pages/Loading'
import Profiles from './pages/Profiles'
import Home from './pages/Home'
import Watch from './pages/Watch'
import CreditsPage from './pages/CreditsPage'
import NotFound from './pages/NotFound'

// New Admin & Couple Imports
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import CouplesList from './admin/CouplesList'
import CoupleEditor from './admin/CoupleEditor'
import TemplateSelector from './admin/TemplateSelector'
import MediaManager from './admin/MediaManager'
import AdminLogin from './admin/AdminLogin'
import CoupleWebsite from './pages/CoupleWebsite'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Loading />,
  },
  {
    path: '/profiles',
    element: <Profiles />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/watch',
    element: <Watch />,
  },
  {
    path: '/credits',
    element: <CreditsPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  // Multi-Tenant Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'couples', element: <CouplesList /> },
      { path: 'couples/:id', element: <CoupleEditor /> },
      { path: 'couples/:id/media', element: <MediaManager /> },
      { path: 'templates', element: <TemplateSelector /> },
      { path: 'orders', element: <div className="p-10"><h2 className="text-2xl font-bold mb-4">Orders</h2><p className="text-gray-400">Coming in a future phase</p></div> },
      { path: 'settings', element: <div className="p-10"><h2 className="text-2xl font-bold mb-4">Settings</h2><p className="text-gray-400">Coming in a future phase</p></div> }
    ]
  },
  // Multi-Tenant Public Couple Route
  {
    path: '/c/:slug',
    element: <CoupleWebsite />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'watch', element: <Watch /> },
      { path: 'credits', element: <CreditsPage /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
