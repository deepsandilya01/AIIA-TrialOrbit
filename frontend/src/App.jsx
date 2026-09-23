import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
