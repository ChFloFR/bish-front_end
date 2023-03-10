import React, { useEffect } from 'react'
import {Helmet} from "react-helmet-async";
import { useDispatch, useSelector } from 'react-redux';
import ShoppingParent from '../../components/cart/ShoppingParent'
import { useNavigate } from 'react-router-dom';
import { selectIdPaymentIntent } from '@/app/redux-store/cartSlice';
import { expirePaymentIntent, selectTimestampPaymentIntent, selectTotal } from '../../redux-store/cartSlice';
import apiBackEnd from './../../api/backend/api.Backend';
import { URL_PRODUITBYSIZE_UPDATE_IN_CART, URL_STRIPE_PAYMENTINTENT_CANCEL, URL_STRIPE_PAYMENTINTENT_UPDATE_AMOUNT } from './../../constants/urls/urlBackEnd';
import { URL_SHOPPING_CART } from '../../constants/urls/urlFrontEnd';
import { selectItems } from './../../redux-store/cartSlice';

const ShoppingCartView = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const idPaymentIntent = useSelector(selectIdPaymentIntent)
  const timestampPaymentIntent = useSelector(selectTimestampPaymentIntent)
  const total = useSelector(selectTotal)
  const items = useSelector(selectItems)

  useEffect(() => {
    if(idPaymentIntent) {
      if(timestampPaymentIntent < Date.now()) {
        apiBackEnd.post(URL_STRIPE_PAYMENTINTENT_CANCEL + idPaymentIntent.id).then(res => {
          let itemsIncrement = []
          items.map(item => {
              itemsIncrement.push(
                {
                  productId: item.id,
                  size: item.size,
                  stock: item.quantityDecrement
                }
              )
          })
          apiBackEnd.post(URL_PRODUITBYSIZE_UPDATE_IN_CART + 'increment', itemsIncrement).then(res => {})
          dispatch(expirePaymentIntent())
          navigate(URL_SHOPPING_CART)
        })
      } else {
        apiBackEnd.post(URL_STRIPE_PAYMENTINTENT_UPDATE_AMOUNT + `${idPaymentIntent.id}` + "/" + `${total}`).then(res => {})
      }
    }
  },[])

  return (
    <div className='w-11/12 md:w-4/6 xl:w-8/12 2xl:w-7/12 m-auto'>
      <Helmet>
        <title>Bish - Panier</title>
      </Helmet>
      <h4 className='mb-5 mt-5 bish-text-blue underline'>Panier</h4>
      <ShoppingParent/>
    </div>
  )
}

export default ShoppingCartView