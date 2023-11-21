import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/auth/signin/SignIn'
import SignUp from './pages/auth/signup/Signup'

import { Suspense } from 'react'
import Main from './components/layout/Main'
import { appRoutes } from './utils/route'

function App() {
  return (
    <>
      <div className='App'>
        <Routes>
          <Route path='signup' element={<SignUp />} />
          <Route path='signin' element={<SignIn />} />
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
                >
                  {route.children
                    ? route.children.map((child, j) => {
                        return (
                          <Route
                            key={child.key || j.toString()}
                            path={child.path}
                            element={
                              <Suspense fallback={<div>loading...</div>}>
                                <child.component />
                              </Suspense>
                            }
                          />
                        )
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
