import React, {useState} from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Routes from './routes/Routes';
import Footer from './components/layouts/Footer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, signOut, selectIsLogged } from './redux-store/authenticationSlice';
import { useDispatch } from 'react-redux';
import apiBackEnd from './api/backend/api.Backend';
import { URL_BACK_DISABLE_USER } from './constants/urls/urlBackEnd';
import CookieConsent from "react-cookie-consent";
import { clearItems } from './redux-store/cartSlice';
import cookies from"../app/assets/images/cookie.gif";

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

    const user = useSelector(selectUser);
    const isLogged = useSelector(selectIsLogged);
    const dispatch = useDispatch();

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    
    useEffect(() => {
        if(isLogged) {
            apiBackEnd.get(URL_BACK_DISABLE_USER + user.id).then(res => {
                if(res.data.disable) {
                    dispatch(signOut());
                }
            })
            if(user.roles[0] === "ROLE_ADMIN") {
                dispatch(clearItems())
            }
        }

    }, [])
    
    // Open modal Cookies
    function openModal() {
        setModalIsOpen(true);
    }
  
    // Close modal Cookies
    function closeModal() {
        setModalIsOpen(false);
    }
    return (
        <BrowserRouter>
            <div className="flex min-h-full cursor-default relative flex-col bish-bg-white">
                <Navbar/>
                <main className="mt-20 flex grow">
                    <Routes />
                </main>
                <CookieConsent
                    location="bottom"
                    buttonText="Accepter"
                    buttonClasses="btn-primary"
                    cookieName="BishCookie"
                    cookieValue={true}

                    enableDeclineButton
                    declineButtonText="Refuser"
                    declineButtonClasses="btn-secondary"
                    declineCookieValue={false}

                    style={{ background: "#2EB7EB" }}
                    buttonStyle={{ background:"#f5f5f5", color: "black", fontSize: "13px" }}
                    declineButtonStyle={{background:"#cfcfcf", color: "black", fontSize: "13px"}}
                    expires={150}
                    > 

                    <img src={cookies}  alt="" className='absolute inset-y-16 right-12 w-24 hidden md:block'/>
                    <h3>Cookies</h3>
                    <p className='text-justify'>Bish et ses partenaires utilisent des cookies pour adapter le contenu de notre site ?? vos pr??f??rences, vous donner acc??s ?? des solutions de la relation client (chat et avis client), vous proposer des offres et publicit??s personnalis??es ou encore pour r??aliser des mesures de performance.Une fois votre choix r??alis??, nous le conserverons pendant 6 mois.Vous pouvez changer d???avis ?? tout moment depuis le lien ?? Les cookies ?? en bas ?? gauche de chaque page de notre site.</p>
                    <a href={window.location.origin + `/protection-de-vos-donnees`} style={{ fontSize: "10px" }}>Consulter la politique de protection de vos donn??es</a>
                </CookieConsent>
                <Footer />         
            </div>
        </BrowserRouter>
    );
};

export default App;
