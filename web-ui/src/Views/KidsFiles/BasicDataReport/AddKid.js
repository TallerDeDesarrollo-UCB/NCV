import React,{useState,useEffect} from 'react';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import FormContainer from '../../../Components/FormContainer';
import InputText from '../../../Components/InputText';
import ButtonPrimary from '../../../Components/MUI-Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../Components/NavBar';

const kidFile = {
  firstName: '',
  lastName: '',
  ci: '',
  birthDate: '',
  programHouse:'',
  birthPlace: '',
  gender: '',
  courtNumber: '',
}

var listCheck = {
    checkFirstName: true,
    checkLastName: true,
    checkCI: true,
    checkBirthDate: true,
    checkProgramHouse: true,
    checkBirthPlace: true,
    checkGender: true
};

var listAlerts = {
    alertFirstName: "El Nombre no debe contener numeros ni debe contener simbolos.",
    alertLastName: "El Apellido no debe contener numeros ni debe contener simbolos.",
    alertCI: "El CI debe ser valido!",
    alertBirthDate: "La fecha de nacimiento debe ser una fecha valida!",
    alertProgramHouse: "La Casa debe ser valida!",
    alertBirthPlace: "El lugar de nacimiento debe ser un lugar valido!",
    alertGender: "Debe seleccionar un genero!"
};

const genders = [
    {
      value: 'M',
      label: 'M',
    },
    {
      value: 'F',
      label: 'F',
    }
  ];

function CreateFile() {
    var url = process.env.REACT_APP_BACKEND_URL + "/api/kids"
    const navigate = useNavigate()
    const [data, setData] = useState(kidFile)
    const [open, setOpen] = useState(false)
    const [firstNameValidation, setFirstNameValidation] = useState(false)
    const [lastNameValidation, setLastNameValidation] = useState(false)
    const [birthDateValidation, setBirthDateValidation] = useState(false)
    const [birthPlaceValidation, setBirthPlaceValidation] = useState(false)

    //ProgramHouses
    const [programHouses, setProgramHouses] = useState([])
    const [listProgramHouses, setListProgramHouses] = useState([])
    var urlProgramHouses = process.env.REACT_APP_BACKEND_URL + '/api/programHouses'
    const fetchProgramHouses = () => {
        var responseProgramHouses = axios(urlProgramHouses);
        axios.all([responseProgramHouses]).then(
            axios.spread((...allData) => {
                var dataBK = allData[0].data
                setProgramHouses(dataBK)
            })
    )}
    useEffect(() => { 
        fetchProgramHouses();
    }, [])
    useEffect(() => {
        var l = [];
        programHouses.forEach(element=>{
            console.log(element);
            l.push({value: element.name, label: element.acronym})
        });
        setListProgramHouses(l);
    }, [programHouses]);
     

    //console.log("programHouses: ",programHouses[0].name )
    // const listProgramHouses = [
    //     {
    //       value: 'Casa Residencial',
    //       label: 'Casa Residencial',
    //     },
    //     {
    //       value: 'Administración',
    //       label: 'Administración',
    //     },
    //     {
    //       value: 'Sendero de Esperanza',
    //       label: 'Sendero de Esperanza',
    //     },
    //     {
    //       value: 'Caminos Abiertos al Cambio',
    //       label: 'Caminos Abiertos al Cambio',
    //     }
    //   ];

    const handleInputChange = (e)=>{
        const {name, value} = e.target
        setOpen(false)
        setData({
            ...data,
            [name]:value
        })
    }

    function resetChecks(){
        listCheck.checkBirthDate = true;
        listCheck.checkBirthPlace = true;
        listCheck.checkCI = true;
        listCheck.checkFirstName = true;
        listCheck.checkGender = true;
        listCheck.checkLastName = true;
        listCheck.checkProgramHouse = true;
    }

    function checkData(dataToCheck){
        var check = true;
        var checkNumbers = /[0-9]/;
        var errors = "";
        
        if(dataToCheck.firstName.match(checkNumbers) != null){
            listCheck.checkFirstName = false;
            check = false;
        }

        if(dataToCheck.lastName.match(checkNumbers) != null){
            listCheck.checkLastName = false;
            check = false;
        }

        if(dataToCheck.birthPlace.match(checkNumbers) != null){
            listCheck.checkBirthPlace = false;
            check = false;
        }

        
        if(data.birthPlace == "" || data.birthPlace == null ){
            console.log("Falta Lugar de Nacimiento");
            errors = errors + " 'Lugar de Nacimiento' "; 
            check = false;
            setOpen(true);
        }

        if(data.gender == "" || data.gender == null ){
            console.log("Falta Genero");
            errors = errors + " 'Genero' "; 
            check = false;
            setOpen(true);
        }

        let actualDate = new Date();
        var selectedYear = dataToCheck.birthDate[0] + dataToCheck.birthDate[1] + dataToCheck.birthDate[2] + dataToCheck.birthDate[3];
        var selectedMonth = dataToCheck.birthDate[5] + dataToCheck.birthDate[6];
        var selectedDay = dataToCheck.birthDate[8] + dataToCheck.birthDate[9];

        if( selectedYear > actualDate.getFullYear()) {
            console.log("Seleccion de año posterior.");
            listCheck.checkBirthDate = false;
            check = false;
        }else{
            if( selectedYear == actualDate.getFullYear() && selectedMonth > (actualDate.getMonth()+1)) {
                console.log("Seleccion de mes posterior.");
                listCheck.checkBirthDate = false;
                check = false;
            }else{
                if( selectedYear == actualDate.getFullYear() && selectedMonth == (actualDate.getMonth()+1) && selectedDay > actualDate.getDate()) {
                    console.log("Seleccion de dia posterior.");
                    listCheck.checkBirthDate = false;
                    check = false;
                }
            }
        }
        return check;
    }

    function handleFormSubmit() {
        resetChecks();
        setFirstNameValidation(false);
        setLastNameValidation(false);
        setBirthDateValidation(false);
        setBirthPlaceValidation(false);
        if(checkData(data) > 0){
            console.log("Form buenardo");
            axios.post(url, data)
            .then(function (response) {
                if (response.status == 201){
                    navigate(`/ninos`,{state:{showAlert:true,alertMessage:"Archivo de niño creado exitosamente"}})
                }
            })
            .catch(function (error) {
                if (error.response){
                    if (error.response.status == 400 )
                        setOpen(true)
                }
            });
        }else{
            console.log("Form terrible, oremos");
            console.log(listCheck);
            if(listCheck.checkFirstName == false) setFirstNameValidation(true);
            if(listCheck.checkLastName == false) setLastNameValidation(true);
            if(listCheck.checkBirthDate == false) setBirthDateValidation(true);
            if(listCheck.checkBirthPlace == false) setBirthPlaceValidation(true);
        }
    }

    //const todayDate = ()=>{
    //    let today = new Date().toISOString().split("T")[0];
    //    document.getElementsByName("birthDate")[0].setAttribute('max',today);
    //}

    return (
        <><Navbar /><div style={{display:'flex', justifyContent:'center', marginTop: '3em'}}>
            <FormContainer title="Registrar nuevo niño">
                <Collapse in={open} sx={{width:1, pt:2}}>
                    <Alert severity="error">
                        Todos los campos son requeridos
                    </Alert>
                </Collapse>
                <InputText
                    required
                    id="firstName"
                    name="firstName"
                    label="Nombres"
                    type="text"
                    value={data.firstName}
                    onChange={handleInputChange}
                />
                <Collapse in={firstNameValidation} sx={{width:1, pt:2}}>
                    <Alert severity="error">
                        {listAlerts.alertFirstName}
                    </Alert>
                </Collapse>
                <InputText
                    required
                    id="lastName"
                    name="lastName"
                    label="Apellidos"
                    type="text"
                    value={data.lastName}
                    onChange={handleInputChange}
                />
                <Collapse in={lastNameValidation} sx={{width:1, pt:2}}>
                    <Alert severity="error">
                        {listAlerts.alertLastName}
                    </Alert>
                </Collapse>
                <InputText
                    required
                    id="ci"
                    name="ci"
                    label="Carnet de identidad (CI)"
                    type="text"
                    value={data.ci}
                    onChange={handleInputChange}
                />
                <InputText
                    required
                    id="birthDate"
                    name="birthDate"
                    label="Fecha de nacimiento"
                    type="date"
                    //max={todayDate}
                    value={data.birthDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleInputChange}
                />
                <Collapse in={birthDateValidation} sx={{width:1, pt:2}}>
                    <Alert severity="error">
                        {listAlerts.alertBirthDate}
                    </Alert>
                </Collapse>
                <InputText
                    required
                    select
                    id="programHouse"
                    name="programHouse"
                    label="Casa"
                    type="text"
                    value={data.programHouse}
                    onChange={handleInputChange}
                >
                {listProgramHouses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
                </InputText>
                <InputText
                    required
                    id="birthPlace"
                    name="birthPlace"
                    label="Lugar de Nacimiento"
                    type="text"
                    value={data.birthPlace}
                    onChange={handleInputChange}
                />
                <Collapse in={birthPlaceValidation} sx={{width:1, pt:2}}>
                    <Alert severity="error">
                        {listAlerts.alertBirthPlace}
                    </Alert>
                </Collapse>
                <InputText
                    required
                    select
                    id="gender"
                    name="gender"
                    label="Genero"
                    type="text"
                    value={data.gender}
                    onChange={handleInputChange}
                >
                {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
                ))}
                /</InputText>
                <ButtonPrimary label={"Registrar"} onClick={handleFormSubmit}/>
            </FormContainer>
        </div></>
    );
}

export default CreateFile;
