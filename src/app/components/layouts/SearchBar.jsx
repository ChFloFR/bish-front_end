import React, {useEffect, useState} from 'react'
import search from "../../assets/images/search.svg"
import apiBackEnd from "@/app/api/backend/api.Backend";
import {URL_PRODUIT_BY_SEARCHBAR} from "@/app/constants/urls/urlBackEnd";
import {URL_PRODUCT_LINK} from "@/app/constants/urls/urlFrontEnd";
import {useNavigate} from "react-router-dom";
import {DebounceInput} from 'react-debounce-input';

const SearchBar = props => {

    const [searchBarDisplay, setSearchBarDisplay] = useState("hidden ");
    const [searchBarClick, setSearchBarClick] = useState(false);
    const [valueSearchBar, setValueSearchBar] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const toggleSearchBar = () =>{
        if(!searchBarClick){
            setSearchBarDisplay("block ");
            props.searchBarToggle(true);
            setSearchBarClick(!searchBarClick);
        }else{
            setSearchBarDisplay("hidden");
            setSearchBarClick(!searchBarClick);
            props.searchBarToggle(false);

        }
    }

    useEffect(() => {
        if(valueSearchBar !== ""){
            apiBackEnd.post(URL_PRODUIT_BY_SEARCHBAR + valueSearchBar).then(res => {
                setProducts(Object.values(res.data))
                }).catch(error => {
                console.log(error)
                })
        }else{
            setProducts([])
        }
    },[valueSearchBar])

    function onChangeValue(event){
        setValueSearchBar(event.target.value)
        if (event.target.value === ""){
            setValueSearchBar("")
        }
    }

    function handleSearchBar(idProduct, event){
        setValueSearchBar("");
        setSearchBarClick(false);
        setSearchBarDisplay("hidden");
        navigate(URL_PRODUCT_LINK + idProduct)

    }

  return (

    <div className="h-8 my-auto mx-0 flex flex-col lg:w-4/6 xl:w-auto">
        <div>
            <form action="#" className={`${searchBarDisplay} lg:block`}>
            <DebounceInput
                type="search"
                name= "searchbar"
                id="searchbar"
                onChange={onChangeValue}
                placeholder="Rechercher..."
                debounceTimeout={500}
                value={`${valueSearchBar}`}
                className={`h-8 ${products.length > 0 ? 'rounded-t-lg' : 'rounded-lg'} border-transparent w-40 sm:w-64 md:w-96 lg:w-72 xl:w-96`}
                />
        </form>
        <button className="lg:hidden" onClick={toggleSearchBar}>
            <img className="h-8 w-auto cursor-pointer" src={search} alt="Recherche"/> 
        </button>
        </div>
        
        {
            products.length > 0 &&
            <div className='flex flex-col bish-bg-white border bish-border-gray w-40 sm:w-64 md:w-96 lg:w-72 xl:w-96'>
                {
                    products.map((product)  => {
                        return (
                            <div className={'flex flex-row items-center justify-between bish-bg-white cursor-pointer hover:bish-bg-blue-light border-b bish-border-white-up py-2 px-5'} onClick={(event) => handleSearchBar(product.id, event)} key={product.id}>
                                <img className={'h-12'} src={window.location.origin + '/src/app/assets/images/products/' + product.pathImage} alt={product.name}/>
                                <span>{product.name}</span>
                                <span>{product.price} ???</span>
                            </div>
                        )
                    })
                }
            </div>
        }
    </div>
  )
}

export default SearchBar