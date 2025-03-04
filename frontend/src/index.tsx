import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login/login';
import MapContainer from './pages/map';
import Dashboard from './pages/dashboard'

import PrivateRoute from './components/privateRoute';

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

                    <Route path="/map" Component={PrivateRoute}>
                        <Route path="/map" Component={ MapContainer } />
                        <Route path="/map/:lat/:lng" Component={ MapContainer } />
                    </Route>

                    <Route path="/dashboard" Component={PrivateRoute}>
                        <Route path="/dashboard" element={ <Dashboard page="feed" /> } />
                        <Route path="/dashboard/pins" element={ <Dashboard page="pins" /> } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContextWrapper>
    );
}

root.render(<App />);
