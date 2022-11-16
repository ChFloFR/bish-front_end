import React, {useState} from "react";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectIsLogged } from "./../../redux-store/authenticationSlice";
import {
  URL_HOME,
  URL_PRODUCTS,
  URL_PRESENTATION,
  URL_BLOG,
  URL_SHOPPING_CART,
  URL_INFOS
} from "../../constants/urls/urlFrontEnd";
import logo from "../../assets/images/logo-bish.svg";
import Account from "../../assets/images/Account.svg";
import Panier from "../../assets/images/Panier.svg";
import search from "../../assets/images/search.svg";
import ScrollingMenu from './ScrollingMenu';
import BurgerMenu from "./BurgerMenu";

const Navbar = () => {
  // const isLoggued = useSelector(selectIsLogged);

  // ---------------------States et Fonction pour le Menu Burger--------------------
  const [burgerClass, setBurgerClass] = useState("burger-bar unclicked");
  const [menuClass, setMenuClass] = useState("hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const updateMenu = () =>{
    setIsMenuClicked(!isMenuClicked);
    if(!isMenuClicked){
      setBurgerClass("burger-bar clicked");
      setMenuClass("w-screen h-full z-10 bish-text-blue flex flex-row bish-bg-white ");
    }else{
      setBurgerClass("burger-bar unclicked");
      setMenuClass("hidden");
    }
  }

  return (
    <div className="absolute w-full bish-bg-blue px-1 lg:px-4 flex flex-row justify-between content-center ">
      {/*--------------------------------- Menu Burger---------------------------------  */}
      <BurgerMenu />

      {/*--------------------------------- LOGO ---------------------------------  */}
      <div>
        <Link to={URL_HOME}>
          <img
            className="h-20 w-20 cursor-pointer"
            src={logo}
            alt="Logo Bish"
          />
        </Link>
      </div>
        
      {/*---------------------------------  Liens navbar --------------------------------- */}

      <div className={`${menuClass} bish-text-white lg:h-8 lg:my-auto lg:block lg:mx-20`}>
        <ul className="flex flex-col lg:flex-row h-8">
          <li className="w-auto border-l px-2 flex justify-center">
            {/* <Link to={URL_PRODUCTS} className="mx-2 font-bold">
              Nos Produits
            </Link>             */}
          </li>
          <li className="w-auto border-l px-2 flex justify-center">
            {/* <Link to={URL_PRESENTATION} className="mx-2 font-bold">
              Qui sommes-nous?
            </Link> */}
          </li>
          <li className="w-auto border-l border-r px-2 flex justify-center">
            {/* <Link to={URL_BLOG} className="mx-2 font-bold">
              Blog
            </Link> */}
          </li>
        </ul>
      </div>

      {/*---------------------------------  Searchbar & Espace Client & Panier ---------------------------------  */}
      <div className="flex flex-row gap-x-4 lg:gap-x-8">

        <div className="h-8 my-auto mx-0">
          <form action="#" className="search-form hidden lg:block">
            <input 
              className="h-8 rounded-full w-72 border-transparent" 
              type="search" 
              name="searchbar" 
              id="searchbar" 
              placeholder="Rechercher..."/>
              <input type="submit" value="" className="hidden"/>
          </form>
            <button className="lg:hidden">
              <img
                  className="h-8 w-auto cursor-pointer"
                  src={search}
                  alt="Panier"/> 
            </button>
        </div>

        {/*--------------------------------- Espace client et panier ---------------------------------  */}

        <div className="flex justify-end my-auto mx-0 gap-x-4 lg:gap-x-8">
            <> 
              <Link to={URL_SHOPPING_CART}>
                <img
                  className="h-8 w-auto cursor-pointer lg:h-8"
                  src={Panier}
                  alt="Panier"
                />                
              </Link>
              {/* <Link to={URL_INFOS}>
                <img
                  className="h-8 w-auto cursor-pointer"
                  src={Account}
                  alt="Espace Client"
                />                    
              </Link> */}
              <ScrollingMenu/>
            </>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
