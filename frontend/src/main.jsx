import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ScrollToTop from './utils/scrollToTop.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <ScrollToTop />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>,
);
