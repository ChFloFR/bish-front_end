import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import { selectIsLogged, signIn, selectUser } from './redux-store/authenticationSlice';
import Routes from './routes/Routes';
import { getToken } from './services/tokenServices';
import { getUser } from './services/userServices';
import Footer from './components/layouts/Footer';
import TailleComponent from './components/layouts/TailleComponent';

const contextClass = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500',
    default: 'bg-indigo-600',
    dark: 'bg-white-600 font-gray-300',
};

/**
 * Component RouteWithNavigation
 * To create the structure of the application (nav bar, routes, toast, etc...)
 *
 * @author Peter Mollet
 */
const App = () => {
    return (
        <BrowserRouter>
            <div className="flex min-h-full cursor-default relative flex-col bish-bg-white">
                <Navbar/>
                <main className="mt-20 flex grow">
                    <Routes />
                </main>
                <Footer />
                
            </div>
        </BrowserRouter>
    );
};

export default App;
