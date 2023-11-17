import { Route, Routes } from 'react-router-dom'
import Main from './components/layout/Main'
import SignIn from './pages/auth/signin/SignIn'
import SignUp from './pages/auth/signup/Signup'

import { appRoutes } from './utils/route'

function App() {
  return (
    <>
      <div className='App'>
        <Routes>
          <Route path='signup' element={<SignUp />} />
          <Route path='signin' element={<SignIn />} />
          <Route element={<Main />}>
            {appRoutes.map((route) => {
              return (
                <Route id={route.key} key={route.key} path={route.path} element={<route.component />}>
                  {route.children
                    ? route.children.map((child) => {
                        return <Route key={child.key} path={child.path} element={<child.component />} />
                      })
                    : null}
                </Route>
              )
            })}
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
