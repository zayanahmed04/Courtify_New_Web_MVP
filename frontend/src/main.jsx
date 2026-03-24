import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Import Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RoleProvider } from './Context/RoleContext.jsx';

createRoot(document.getElementById('root')).render(
  <RoleProvider>
  <BrowserRouter>
    <>
      <App />
      {/* ToastContainer yahan globally available */}
      <ToastContainer
        position="top-right"
        autoClose={3000}   // auto close after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  </BrowserRouter>
  </RoleProvider>
);
