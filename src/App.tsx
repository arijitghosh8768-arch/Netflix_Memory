import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import Loading from './pages/Loading'
import Profiles from './pages/Profiles'
import Home from './pages/Home'
import Watch from './pages/Watch'
import CreditsPage from './pages/CreditsPage'
import NotFound from './pages/NotFound'

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
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
