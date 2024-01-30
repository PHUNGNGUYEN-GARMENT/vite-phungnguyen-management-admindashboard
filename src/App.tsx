import { Route, Routes, useNavigate } from 'react-router-dom'

import { Suspense, useEffect } from 'react'
import Main from './components/layout/Main'
import useLocalStorage from './hooks/useLocalStorage'
import LoginPage from './pages/authen/LoginPage'
import { appRoutes } from './utils/route'

function App() {
  const navigate = useNavigate()
  const [accessToken] = useLocalStorage('accessToken', null)
  // const navigate = useNavigate()
  // const currentUser = useSelector((state: RootState) => state.user)
  // const [loading, setLoading] = useState<boolean>(false)
  // const { isAuth } = useAuth(setLoading)

  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    }
  }, [accessToken])

  return (
    <>
      <div className='App'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='login' element={<LoginPage />} />
            <Route element={<Main />}>
              {appRoutes.map((route, i) => {
                return (
                  <Route
                    id={route.key || i.toString()}
                    key={route.key}
                    path={route.path}
                    element={
                      <Suspense fallback={<div>loading...</div>}>
                        <route.component />
                      </Suspense>
                    }
                  />
                )
              })}
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
