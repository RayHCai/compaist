import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login/login';
import Map from './pages/map';

import UserContextWrapper from './contexts/userContext';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

function App() {
    return (
        <UserContextWrapper>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={ Home } />

                    <Route path="/login" Component={ Login } />

                    <Route path="/map" Component={ Map } />
                </Routes>
            </BrowserRouter>
        </UserContextWrapper>
    );
}

root.render(<App />);
