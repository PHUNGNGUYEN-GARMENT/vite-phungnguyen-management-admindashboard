import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import '~/styles/global.css'
import App from './App.tsx'
import { store } from './store/index.ts'
import theme from './styles/theme.config.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </Router>
  </Provider>
  // </React.StrictMode>
)
