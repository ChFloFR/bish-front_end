import React, { useEffect } from 'react'
import { useStep } from './CartOutletValidation';
import StripeContainer from "@/app/views/ClientView/CartValidation/StripeContainer";

const Paiement = () => {

  const { setStep } = useStep();

  useEffect(() => {
    setStep(3)
  },[])

  return (
        <StripeContainer />
    );
};
export default Paiement
