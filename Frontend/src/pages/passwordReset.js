import '../styles/login.css'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Footer from "../components/footer";
import Swal from 'sweetalert2'
import UserApi from '../services/users'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useState, Fragment, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';
import RadioButtonCheckedTwoToneIcon from '@mui/icons-material/RadioButtonCheckedTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@mui/icons-material/RadioButtonUncheckedTwoTone';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

function App() {
    const navigate = useNavigate();
    const [isRequired, setRequired] = useState(false);
    const [isMinLength, setMinLength] = useState(false);
    const [isUppercase, setUppercase] = useState(false);
    const [isMaxLength, setMaxLength] = useState(false);
    const [isLowercase, setLowercase] = useState(false);
    const [isSpecial, setSpecial] = useState(false);
    const [isNumber, setNumber] = useState(false);
    const [token, setToken] = useState(null);
    const [id, setId] = useState(null);
    const schema = Yup.object().shape({
        password: Yup.string().when('password', (password, field) => {
            if (password == null) {
                setRequired(false)
                return field.required()
            } else {
                setRequired(true)
            }
        }).when('password', (password, field) => {
            if (password?.length <= 8) {
                setMinLength(false)
                return field.min(8)
            } else {
                setMinLength(true)
            }
        }).when('password', (password, field) => {
            if (password?.length >= 100) {
                setMaxLength(false)
                return field.min(100)
            } else {
                setMaxLength(true)
            }
        }).when('password', (password, field) => {
            if (!(/[A-Z]+/.test(password))) {
                setUppercase(false)
                return field.matches(/[A-Z]+/)
            } else {
                setUppercase(true)
            }
        }).when('password', (password, field) => {
            if (!(/[a-z]+/.test(password))) {
                setLowercase(false)
                return field.matches(/[a-z]+/)
            } else {
                setLowercase(true)
            }
        }).when('password', (password, field) => {
            if (!(/[@$!%*#?&]+/.test(password))) {
                setSpecial(false)
                return field.matches(/[@$!%*#?&]+/)
            } else {
                setSpecial(true)
            }
        }).when('password', (password, field) => {
            if (!(/[0-9]/.test(password))) {
                setNumber(false)
                return field.matches(/[0-9]/)
            } else {
                setNumber(true)
            }
        }),
    }, ["password", "password"]);

    function submit(data) {
        data.token = token;
        data.userid = id;

        UserApi.resetPassword(data).then(res => {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                title: `Contraseña actualizada exitosamente`,
            }).then(() => navigate("/login"));
        }).catch(err => {
            if (err.response.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "No se encontró solicitud asociada para cambio de contraseña esto se debe porque el tiempo de 1hora establecido expiro o se solicitó un nuevo cambio de contraseña.",
                });
            } else {
                Swal.fire({
                    timer: 2000,
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'Error',
                    text: "Ocurrió  algo al actualizar la contraseña solicite el cambio nuevamente, si el problema persiste contacte a los administradores",
                });
            }

        });
    }
    const search = useLocation().search;

    useEffect(() => {
        let tempToken = new URLSearchParams(search).get('token');
        let tempId = new URLSearchParams(search).get('userid');
        if (!tempToken && !tempId) {
            navigate("/");
        }
        setToken(tempToken);
        setId(tempId);
    }, [])

    return (
        <div>
            <div>
                <Formik
                    validationSchema={schema}
                    initialValues={{ password: "" }}
                    onSubmit={submit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    }) => (
                        <div className="login">
                            <div className="form">
                                <form noValidate onSubmit={handleSubmit}>
                                    <span>
                                        <IconButton component={Link} to={"/"}>
                                            <ArrowBackRoundedIcon />
                                        </IconButton>
                                        Recuperacion de contraseña
                                    </span>
                                    <Tooltip title={
                                        <Fragment>
                                            <Stack direction='column' width="100%" spacing={2} justifyContent="flex-start" alignItems="flex-start" paddingBottom={2}>
                                                <Typography fontSize={12}>
                                                    {(isMinLength && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} Contraseña debe tener al menos 8 caracteres
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isUppercase && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} Contraseña debe tener una letra mayuscula
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isMaxLength && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} Contraseña debe tener maximo 100 caracteres
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isLowercase && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} Contraseña debe tener una letra minuscula
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isSpecial && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} Contraseña debe tener un simbolo
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isNumber && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} Contraseña debe tener un numero
                                                </Typography>
                                            </Stack>
                                        </Fragment>
                                    } placement="right">
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            placeholder="Nueva contraseña"
                                            className="form-control"
                                        />
                                    </Tooltip>

                                    <button type="submit">Actualizar</button>
                                </form>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
            <Footer />
        </div>
    );
}

export default App;