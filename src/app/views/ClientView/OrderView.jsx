import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import Order from "../../components/client/Order";
import { URL_404 } from '../../constants/urls/urlFrontEnd';

function OrderView() {

    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        !location.state && navigate(URL_404)
    }, [])

    return (
        <div className="h-full">
            <Helmet></Helmet>
            {location.state && <Order id={location.state.id}/>}
        </div>
    );
}

export default OrderView;
