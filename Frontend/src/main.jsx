import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import store from './redux/store'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist';

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
      <Toaster />
    </Provider>
  </StrictMode>,
)
