import React, {useEffect, useState} from 'react'
import apiBackEnd from "../../api/backend/api.Backend";
import {URL_BACK_CODE_PROMOS_DELETE, URL_BACK_CODE_PROMOS} from "../../constants/urls/urlBackEnd";
import {ToastContainer,toast} from "react-toastify";
import {Helmet} from "react-helmet-async";
import loadingSVG from "../../assets/images/loading-spin.svg";
import TableRow from "../../components/admin/TableRow";
import TitleContainer from "../../components/admin/TitleContainer";
import TableHeadSort from "../../components/admin/TableHeadSort";
import FormCreate from "../../components/admin/codepromo/FormCreate";
import FormUpdate from "../../components/admin/codepromo/FormUpdate";
import CheckboxRow from './../../components/admin/CheckboxRow';
import CheckRowsContainer from './../../components/admin/CheckRowsContainer';
import TableHeadCheckbox from './../../components/TableHeadCheckbox';
import {URL_BACK_CODE_PROMOS_MULTIPLE_REMOVE} from "../../constants/urls/urlBackEnd"

const AdminCodePromoView = () => {

       // Style
       const headSort = 'flex py-5 justify-center items-center space-x-2 cursor-pointer'
       const labelHeader = 'truncate hover:text-clip'
   
       // Contenu d'un ligne de la table (sans les keys, que les datas)
       const [rows, setRows] = useState([])
   
       const [modalIsOpen, setIsOpen] = useState(false);
   
       // Formulaire UPDATE
       const [formUpdate, setFormUpdate] = useState([])
   
       // SVG isLoading si requête en cours
       const [isLoading, setIsLoading] = useState(false);
   
       // Formulaire CREATE
       const [formCreate, setFormCreate] = useState()
   
       // Reload table
       const [reload, setReload] = useState(false);
   
       const [rowsCheck, setRowsCheck] = useState([])
       const [allPromosId, setAllPromosId] = useState([])
       
       useEffect(() => {
           setRows([])
           setFormUpdate([])
           setRowsCheck([])
           setAllPromosId([])
           // Permet d'afficher le SVG de chargement
           setIsLoading(true)
           // Récupération des données
           apiBackEnd.get(URL_BACK_CODE_PROMOS).then(respArr => {
               // Set le contenu d'une row (à mettre dans l'ordre voulu)
               respArr.data.map(res => setAllPromosId(current => [...current, res.id]))
               respArr.data.map((res, index) => setRows(current => [...current, [
                   <CheckboxRow id={res.id} setRowsCheck={setRowsCheck} />,
                   res.id,
                   res.name,
                   res.type === "pourcent" ? res.remise +' %':  res.type === "euro" && res.remise +' €',
                   res.montantMin + " €",
                   res.startDate.date + " " + res.startDate.time,
                   res.endDate.date + " " + res.endDate.time
               ]]))
   
               respArr.data.map((res, index) => {
                   // Formulaire UPDATE
                   setFormUpdate(current => [...current,
                       <FormUpdate codePromo={res} index={index} updateTable={updateTable}/>
                   ])
               })
   
               // Formulaire CREATE
               setFormCreate(
                   <FormCreate reload={reload} setReload={setReload} close={closeModal}/>
               )
               // Fin du chargement
               setIsLoading(false)
           })
       }, [reload])
   
       const updateTable = (promotion,values, index, startDate, startEnd, startTime, endTime, startFullDate, endFullDate)=> {
        
           promotion.name = values.name
           promotion.remise = values.remise
           promotion.montantMin = values.montantMin
           promotion.start_date = startFullDate + ' ' + startTime
           promotion.end_date = startEnd + ' ' + endTime
           promotion.startDateEN = startFullDate 
           promotion.endDateEN = startEnd
   
           // Modifier la row concernée par l'update
           setFormUpdate(current=> [
               ...current.slice(0, index),
               <FormUpdate codePromo={promotion} index={index} updateTable={updateTable}/>,
               ...current.slice(index+1)
           ])
           setRows(current => [
               ...current.slice(0, index),
               [
                   <CheckboxRow id={promotion.id} setRowsCheck={setRowsCheck} />,
                   promotion.id,
                   promotion.name,
                   promotion.remise,
                   promotion.montantMin,
                   startDate + ' ' + startTime,
                   startEnd + ' ' + endTime,
                  ],
               ...current.slice(index+1)
           ])
       }
   
       const deleteRow = id => {
           if (window.confirm(`Êtes-vous sûr de vouloir supprimer le code promotion ${id} ?`)) {
               apiBackEnd.delete(URL_BACK_CODE_PROMOS_DELETE + id).then(res => {
                   if (res.status === 200) {
                       // Supprimer l'elément delete de la table
                       setRows(rows.filter(res => res[1] !== id))
                       // Notification promotion supprimé
                       toast.success(`Code Promo ${id} supprimé !`, {
                           position: "top-right",
                           autoClose: 5000,
                           hideProgressBar: false,
                           closeOnClick: true,
                           pauseOnHover: true,
                           draggable: true,
                           progress: undefined,
                           theme: "light"
                       })
                   }
               }).catch(error => {
                console.log(error);
                   if (error.response.data.errorCode === '006') {
                       // Notification promotion en cours de commande
                       toast.warn(error.response.data.errorMessage, {
                           position: "top-right",
                           autoClose: 5000,
                           hideProgressBar: false,
                           closeOnClick: true,
                           pauseOnHover: true,
                           draggable: true,
                           progress: undefined,
                           theme: "light"
                       });
                   }
               })
           }
       }
   
       // Open modal CREATE
       function openModal() {
           setIsOpen(true);
       }
   
       // Close modal CREATE
       function closeModal() {
           setIsOpen(false);
       }

  return (
    <div className='w-full ml-12 sm:ml-64'>
    <Helmet>
        <title>Bish - Admin Promotion</title>
    </Helmet>
    {/* Notifications */}
    <ToastContainer/>
    {/* TITRE + BUTTON AJOUTER */}
    <TitleContainer form={formCreate} name="Code Promotion" modalIsOpen={modalIsOpen} openModal={openModal}
                    closeModal={closeModal} addButton={true} search={true}/>
    {/* LIGNES CHECK + ACTIONS */}
    <CheckRowsContainer rowsCheck={rowsCheck} typeRequest="DELETE" deleteBackUrl={URL_BACK_CODE_PROMOS_MULTIPLE_REMOVE} setReload={setReload} reload={reload} setIsLoading={setIsLoading} isLoading={isLoading} />
    {/* Modal CREATE */}

    {isLoading ? (<img className='absolute top-1/3 left-1/2' src={loadingSVG} alt="Chargement"></img>)
        :
        (
            <table className="table-fixed w-full pl-5 mt-20" id="searchTable">
                {/* Nom de chaque colonne */}
                <thead className='border-b-4 bish-border-gray sticky top-40 bish-bg-white shadow'>
                <tr>
                    {/* Tous les titres dans le header de la table */}
                    <TableHeadCheckbox setRowsCheck={setRowsCheck} allIds={allPromosId} />
                    <TableHeadSort nbSortColumn="0" name="Id"/>
                    <TableHeadSort nbSortColumn="1" name="Nom"/>
                    <TableHeadSort nbSortColumn="2" name="Remise"/>
                    <TableHeadSort nbSortColumn="3" name="Montant min"/>
                    <TableHeadSort nbSortColumn="4" name="Date de début"/>
                    <TableHeadSort nbSortColumn="5" name="Date de fin"/>
                    {/* TH Actions à ne pas supprimer */}
                    <th className={labelHeader} colSpan='2' title='Actions'>Actions</th>
                </tr>
                </thead>
                {/* Contenu de la table */}
                <tbody>
                {/* Retourne une ligne pour chaque élément */}
                {rows && rows.map((res, index) => <TableRow key={index} element={res} deleteRow={deleteRow}
                                                            formUpdate={formUpdate[index]}
                                                            disabledEdit={false}/>)}
                </tbody>
            </table>
        )
    }
</div>
)
}

export default AdminCodePromoView