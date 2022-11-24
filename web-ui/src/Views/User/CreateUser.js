/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect} from 'react'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/NavBar'
import FormContainer from '../../Components/FormContainer'
import InputText from '../../Components/InputText'
import Collapse from '@mui/material/Collapse'
import MenuItem from '@mui/material/MenuItem'
import ButtonPrimary from '../../Components/MUI-Button'
import Alert from '@mui/material/Alert'
import emailjs from 'emailjs-com'

const user = {
    firstName: '',
    lastName: '',
    cellPhone: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: ''
}
const roles = [
    {
        label: 'Tia',
        value: 'AuntUser'
    },
    {
        label: 'Administrador',
        value: 'AdminUser'
    },
    {
        label: 'Super Usuario',
        value: 'Soporte'
    }
]

function CreateUser() {
    var url = 'https://ncv-api.azurewebsites.net/api/auth'
    //var url = 'http://localhost:5009/api/auth' 
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(user)
    const [formErrors,setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setOpen(false)
        setData({
            ...data,
            [name]: value
        })
    }

    function handleFormSubmit() {
        setFormErrors(validate(data));
        setIsSubmit(true)
        axios
            .post(`${url}/${data.rol}`, data)
            .then(function (response) {
                if (response.status == 200) {
                    emailjs.send(
                        'service_fqnko4m',
                        'template_1cszhti',
                        {
                            firstName: data.firstName,
                            email: data.email,
                            password: data.password
                        },
                        'gP3o_iD52sF8GJvJH'
                    )
                    navigate(`/vista-usuarios`,{state:{showAlert:true,alertMessage:"Usuario creado exitosamente"}})
                }
            })
            .catch(function (error) {
                if (error.response) {
                    //errores=handleValidation();
                    //alert(error.name)
                    if (error.response.status >= 400 || error.response.status <= 500) 
                        setOpen(true)
                }
            })
    };


    useEffect(()=>{
        console.log(formErrors)
        if (Object.keys(formErrors).length === 0 && isSubmit){
           console.log(data);
        }
    },[formErrors]);

    const validate = (datas) => {
        const errors = {};
        const regex =  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regexUpperCase = /^.*[A-Z]/;
        const regexLowerCase = /^.*[a-z]/;
        const regexNumber = /^.*[0-9]/;
        const regexCharacter= /^.*[!@#$%^&*]/;
        if(!datas.firstName){
            errors.firstName= "El nombre es requerido!";
        }

        if(!datas.lastName){
            errors.lastName= "El apellido es requerido!";
        }

        if(!datas.cellPhone){
            errors.cellPhone= "El celular es requerido!";
        }

        if(!datas.email){
            errors.email= "El correo es requerido!";
        }else if (!regex.test(datas.email)){
            errors.email = "Formato de correo incorrecto!"
        }

        if(!datas.password){
            errors.password= "La contraseña es requerida";
        }else if (datas.password.length<8){
            errors.password= "La contraseña debe tener almenos 8 caracteres";
        }else if(!regexUpperCase.test(datas.password)){
            errors.password= "La contraseña debe tener almenos una mayúscula";
        }else if(!regexLowerCase.test(datas.password)){
            errors.password= "La contraseña debe tener almenos una minúscula";
        }else if(!regexNumber.test(datas.password)){
            errors.password= "La contraseña debe tener almenos una numero";
        }else if(!regexCharacter.test(datas.password)){
            errors.password= "La contraseña debe tener almenos caracter especial";
        }

        if(!datas.confirmPassword){
            errors.confirmPassword= "Confirmar la contraseña es obligatorio!";
        }else if(datas.password!= datas.confirmPassword){
            errors.confirmPassword = "Las contraseñas no coinciden"
        }

        if(!datas.rol){
            errors.rol= "El rol es requerido!";
        }

        return errors;

    }

    return (
        <>
            <Navbar />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '3em'
                }}
            >
                <FormContainer title="Registrar nuevo usuario">
                    <Collapse  in={open} sx={{ width: 1, pt: 2 }}>
                        <Alert severity="error"> 
                            Todos los campos son requeridos                          
                        </Alert>
                    </Collapse>

                    <InputText
                        required
                        id="firstName"
                        name="firstName"
                        label="Nombre"
                        type="text"
                        value={data.firstName}
                        onChange={handleInputChange}
                    />
                    {formErrors.firstName? <Alert  sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.firstName}                          
                    </Alert>:<p></p> }
                    <InputText
                        required
                        id="lastName"
                        name="lastName"
                        label="Apellido"
                        type="text"
                        value={data.lastName}
                        onChange={handleInputChange}
                    />
                    {formErrors.lastName? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.lastName}                          
                    </Alert>:<p></p> }
                    
                    <InputText
                        required
                        id="cellPhone"
                        name="cellPhone"
                        label="Celular"
                        type="number"
                        value={data.cellPhone}
                        onChange={handleInputChange}
                    />
                    {formErrors.cellPhone? <Alert  sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.cellPhone}                          
                    </Alert>:<p></p> }
                    <InputText
                        required
                        id="email"
                        name="email"
                        label="Correo electronico"
                        type="email"
                        value={data.email}
                        onChange={handleInputChange}
                    />
                    {formErrors.email? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.email}                          
                    </Alert>:<p></p> }
                    <InputText
                        required
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={data.password}
                        onChange={handleInputChange}
                    />
                    {formErrors.password? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.password}                          
                    </Alert>:<p></p> }
                  
                    <InputText
                        required
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirmar contraseña"
                        type="password"
                        value={data.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {formErrors.confirmPassword? <Alert sx={{ width: 1, pt: 1 }} severity="error"> 
                        {formErrors.confirmPassword}                          
                    </Alert>:<p></p> }
                    <InputText
                        required
                        select
                        id="rol"
                        name="rol"
                        label="Rol"
                        type="text"
                        value={data.rol}
                        onChange={handleInputChange}
                    >
                        {roles.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </InputText>
                    {formErrors.rol? <Alert sx={{ width: 1, pt: 1, marginBottom:2 }} severity="error"> 
                        {formErrors.rol}                          
                    </Alert>:<p></p> }
                    <ButtonPrimary
                        label={'Registrar'}
                        onClick={handleFormSubmit} 
                    />
                </FormContainer>
                <script
                    type="text/javascript"
                    src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
                ></script>

                <script type="text/javascript">
                    emailjs.init('gP3o_iD52sF8GJvJH')
                </script>
            </div>
        </>
    )
}

export default CreateUser
