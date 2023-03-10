import React, { useEffect, useState } from 'react'
import { useStep } from './CartOutletValidation';
import {ULR_BACK_CREATE_COMMANDES, URL_CONFIRM_PAYMENT} from '@/app/constants/urls/urlBackEnd';
import {URL_CART_CONFIRM} from '@/app/constants/urls/urlFrontEnd';
import { useSelector } from 'react-redux';
import {
  clearItems,
  selectDeliveryAddress,
  selectIdPaymentIntent,
  updateDiscount
} from '../../../redux-store/cartSlice';
import { selectBillingAddress, selectItems, selectTotal, selectTotalBeforeDiscount } from './../../../redux-store/cartSlice';
import checkIMG from '../../../assets/images/check.png'
import apiBackEnd from "@/app/api/backend/api.Backend";
import {Link, useNavigate} from "react-router-dom";
import { URL_BACK_CODE_PROMOS_FIND_BY_NAME, URL_STRIPE_PAYMENTINTENT_UPDATE_AMOUNT } from '../../../constants/urls/urlBackEnd';
import { useDispatch } from 'react-redux';
import { URL_CART_PAIEMENT } from './../../../constants/urls/urlFrontEnd';

const Resume = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setStep } = useStep();

  const [codePromo, setCodePromo] = useState("")
  const [codePromoErrorMsg, setCodePromoErrprMsg] = useState()
  const [codePromoSuccess, setCodePromoSuccess] = useState(false)
  // const [cardInfos, setCardInfos] = useState()

  const deliveryAddress = useSelector(selectDeliveryAddress)
  const billingAddress = useSelector(selectBillingAddress)
  const idPaymentId = useSelector(selectIdPaymentIntent)
  const items = useSelector(selectItems)
  const totalBeforeDiscount = useSelector(selectTotalBeforeDiscount)
  const total = useSelector(selectTotal)
  const idPaymentIntent = useSelector(selectIdPaymentIntent)

  useEffect(() => {
      setStep(2)
      apiBackEnd.post(URL_STRIPE_PAYMENTINTENT_UPDATE_AMOUNT + `${idPaymentIntent.id}` + "/" + `${total}`).then(res => {
        // setCardInfos(res.data[1].card)
      })
  }, [])

  // const payment = () => {
  //   apiBackEnd.post(URL_STRIPE_PAYMENTINTENT_UPDATE_AMOUNT + `${idPaymentIntent.id}` + "/" + `${total}`).then(res => {
  //     handleSubmit()
  //   })
  // }

  // const handleSubmit = async (event) => {
    // let products = []
    // for (let i = 0; i< items.length; i++) {
    //   let product = {
    //       id : items[i].id,
    //       quantity : items[i].quantity,
    //       price : items[i].lastKnownPrice,
    //       remise : 50,
    //       size : items[i].size,
    //       name : items[i].name
    //     }
    //   products.unshift(product);
    // }
  
    // apiBackEnd.post(URL_CONFIRM_PAYMENT + idPaymentId.id).then(res => {
    //   let commande = {
    //     userId : localStorage.id,
    //     rueLivraison : deliveryAddress.rue,
    //     num_rueLivraison : deliveryAddress.num_rue,
    //     villeLivraison : deliveryAddress.city,
    //     rueFacturation : billingAddress.rue,
    //     num_rueFacturation : billingAddress.num_rue,
    //     villeFacturation : billingAddress.city,
    //     complement_adresseLivraison : deliveryAddress.complement_adresse,
    //     complement_adresseFacturation : billingAddress.complement_adresse,
    //     code_postalLivraison : deliveryAddress.postal_code,
    //     code_postalFacturation : billingAddress.postal_code,
    //     etat_commande : "En pr??paration",
    //     produits : products
    //   }
    //   apiBackEnd.post(ULR_BACK_CREATE_COMMANDES,commande).then(res => {
    //     dispatch(clearItems())
    //     navigate(URL_CART_CONFIRM, {state : {idCommande : res.data.id} })
    //   })

    // })
  // }

  const handleCodePromo = () => {
    apiBackEnd.post(URL_BACK_CODE_PROMOS_FIND_BY_NAME, {name: codePromo, total: total}).then(res => {
      const data = res.data
      if(data.error) {
        setCodePromoErrprMsg(data.message)
      } else {
        setCodePromoErrprMsg()
        if(total >= data.montantMin) {
          dispatch(updateDiscount({
            remise : data.remise,
            type: data.type
          }))
          apiBackEnd.post(URL_STRIPE_PAYMENTINTENT_UPDATE_AMOUNT + `${idPaymentIntent.id}` + "/" + `${total}`).then(res => {})
          setCodePromoSuccess(true)
        } else {
          setCodePromoErrprMsg("D??sol??, ce code ne s'applique pas au contenu de votre panier")
        }
      }
    })
  }

  return (
    <div className='my-10 space-y-10'>
      <div className='flex flex-col md:flex-row place-items-end md:place-items-start'>
        <div className='flex flex-col w-full md:w-2/3 gap-y-10'>
          {/* Adresse de livraison */}
          <div className='flex flex-row'>
            <h5 className='border-r bish-border-white-up px-5 w-1/2'>Adresse de livraison</h5>
            <div className='flex flex-col px-5 w-1/2'>
              <span className='font-bold'>{deliveryAddress.name}</span>
              <span>{deliveryAddress.num_rue + ' ' + deliveryAddress.rue}</span>
              <span>{deliveryAddress.postal_code + ' ' + deliveryAddress.city}</span>
              <span>{deliveryAddress.complement_adresse}</span>
            </div>
          </div>
          {/* Adresse de facturation */}
          <div className='flex flex-row'>
            <h5 className='border-r bish-border-white-up px-5 w-1/2'>Adresse de facturation</h5>
            <div className='flex flex-col px-5 w-1/2'>
              <span className='font-bold'>{billingAddress.name}</span>
              <span>{billingAddress.num_rue + ' ' + billingAddress.rue}</span>
              <span>{billingAddress.postal_code + ' ' + billingAddress.city}</span>
              <span>{billingAddress.complement_adresse}</span>
            </div>
          </div>
          {/* Moyen de paiement */}
          {/* <div className='flex flex-row'>
            <h5 className='border-r bish-border-white-up px-5 w-1/2'>Moyen de paiement</h5>
            {
              cardInfos &&
              <div className='flex flex-col px-5 w-1/2'>
                <span className='font-bold'>{cardInfos.brand.toUpperCase()}</span>
                <span>Carte de d??bit se terminant par ???????????? {cardInfos.last4}</span>
                <span>Expire le {("0" + cardInfos.exp_month.toString()).slice(-2)}/{cardInfos.exp_year.toString().slice(-2)}</span>
              </div>
            }
          </div> */}
        </div>
        <div className='w-full sm:w-1/2 md:w-1/3 bish-bg-gray-shop shadow p-5 flex flex-col justify-between my-10 md:my-0'>
          <div className='flex flex-col mb-10'>
            <h5>Ma commande</h5>
            <div className='flex flex-col my-2'>
              {
                items.map((res, index) => 
                  <div className='flex flex-row justify-between gap-x-2' key={index}>
                    <span>{res.name} {res.size.toUpperCase()} x2</span>
                    <span>{res.lastKnownPrice.toFixed(2)}</span>
                  </div>
                )
              }
            </div>
          </div>
          <div className='flex flex-col gap-y-2'>
            <div className='flex flex-col gap-y-2'>
              <h5>Code promo</h5>
              <div className='flex flex-row gap-x-2'>
                <input className='w-4/5 rounded border bish-border-gray' type="text" onChange={e => setCodePromo(e.currentTarget.value)} />
                <button className='w-1/5 rounded border bish-border-blue hover:bish-bg-blue-opacity py-2' onClick={() => handleCodePromo()}>
                  <img src={checkIMG} alt="Valider le code promo" className='w-6 m-auto' />
                </button>
              </div>
              { codePromoErrorMsg ? <span className='text-red-500'>{codePromoErrorMsg}</span> : codePromoSuccess && <span className='text-green-500'>Une r??duction a ??t?? appliqu??e</span>}
            </div>
            <div className='flex flex-col text-right border-t bish-border-gray pt-2'>
              {(totalBeforeDiscount - total) > 0 &&
                <>
                  <span><span className='font-medium'>Total:</span> {totalBeforeDiscount.toFixed(2)}???</span>
                  <span><span className='font-medium'>R??duction:</span> - {(totalBeforeDiscount - total).toFixed(2)}???</span>
                </>
              }
              <span className='text-lg'><span className='font-semibold'>A payer:</span> {total.toFixed(2)}???</span>
            </div>
            <Link to={URL_CART_PAIEMENT} className={"border rounded py-2 justify-center bish-bg-blue bish-text-white text-center"}>Confirmer</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resume