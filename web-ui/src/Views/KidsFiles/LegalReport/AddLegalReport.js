import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import ButtonPrimary , { ButtonSecondary } from '../../../Components/MUI-Button'
import InputText from '../../../Components/InputText'
import FormContainer from '../../../Components/FormContainer'
import axios from 'axios'
import Navbar from '../../../Components/NavBar';
import { Box } from '@mui/system';
const legalReport = {
    courtNumber: '',
    dna: '',
    nurej: '',
    legalProcesses: ''
}

function AddLegalReport() {
    const navigate = useNavigate();
    const {kidId} = useParams()
    var url = process.env.REACT_APP_BACKEND_URL + "/api/kids/" + kidId +"/legalreports"

    const [formReport, setformReport] = useState(legalReport)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState("")

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setOpen(false)
        setformReport({
            ...formReport,
            [name]: value
        })
    }

    function checkFields(){
        var res = true;
        var errors = "";
        if(formReport.courtNumber == "" || formReport.courtNumber == null ){
            console.log("Falta Num Corte");
            errors = errors + " 'Numero de Corte' "; 
            res = false;
            setOpen(true);
        }
        if(formReport.dna == "" || formReport.dna == null ){
            console.log("Falta DNA");
            if(errors != "") errors = errors + ", ";
            errors = errors + " 'DNA' "; 
            res = false;
            setOpen(true);
        }
        if(formReport.nurej == "" || formReport.nurej == null ){
            console.log("Falta NUREJ");
            if(errors != "") errors = errors + ", ";
            errors = errors + " 'NUREJ' "; 
            res = false;
            setOpen(true);
        }
        var alertError = "Los campos:" + errors + "son requeridos."
        setAlert(alertError);
        return res;
    }
    
    function handleFormSubmit() {
        setOpen(false);
        if(checkFields()){
            axios.post(url, formReport)
            .then(function (response) {
                if (response.status == 200){
                    navigate(`/ninos/${kidId}`,{state:{showAlert:true,alertMessage:"Reporte Legal creado"}});
                }
            })
            .catch(function (error) {
                if (error.response){
                    if (error.response.status == 400 )
                        setOpen(true)
                }
            });
        }
    }

    function handleClose() {
        navigate(`/ninos/${kidId}`,{state:{showAlert:true,alertMessage:"Reporte Legal no creado"}});
    }
    return (
        <><Navbar /><div style={{marginTop: '3em', display:'flex', justifyContent:'center'}}>
            <FormContainer title="Reporte Legal">
                <Collapse in={open} sx={{width:1, pt:2}}>
                    <Alert severity="error">
                        {alert}
                    </Alert>
                </Collapse>
                <InputText
                    required
                    id="courtNumber"
                    name="courtNumber"
                    label="Número de Corte"
                    value={formReport.courtNumber}
                    onChange={handleInputChange}
                />
                <InputText
                    required
                    id="dna"
                    name="dna"
                    label="DNA"
                    type="text"
                    value={formReport.dna}
                    onChange={handleInputChange}
                />
                <InputText
                    required
                    id="nurej"
                    name="nurej"
                    label="NUREJ"
                    type="text"
                    value={formReport.nurej}
                    onChange={handleInputChange}
                />
                <InputText
                    multiline={true}
                    id="legalProcesses"
                    name="legalProcesses"
                    label="Procesos legales"
                    helperText="Opcional"
                    value={formReport.legalProcesses}
                    onChange={handleInputChange}
                />
                <Box sx={{display: 'inline'}}>
                    <ButtonSecondary label="Cancelar" onClick={handleClose}></ButtonSecondary>
                    <ButtonPrimary label={"Crear reporte legal"} onClick={handleFormSubmit}></ButtonPrimary>
                </Box>
            </FormContainer>
        </div></>
    )
}
export default AddLegalReport
