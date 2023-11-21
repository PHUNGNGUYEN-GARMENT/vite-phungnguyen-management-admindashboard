import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import '~/styles/global.css'
import App from './App.tsx'
import store from './redux/store.ts'
import theme from './styles/theme.config.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ConfigProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ConfigProvider>
    </Router>
  </React.StrictMode>
)
