import '../styles/login.css'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Footer from "../components/footer";
import Swal from 'sweetalert2'
import UserApi from '../services/users'
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

function App() {
    const schema = Yup.object().shape({
        email: Yup.string()
            .required("El correo es requerido")
            .email("Correo invalido"),
    });

    function submit(data) {
        UserApi.requestPasswordReset(data).then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Se envió un mail a su dirección de correo electrónico, si encuentra el correo en su bandeja con el título "Recuperación de cuenta" por favor revise spam.',
            });
        }).catch(err => {
            if (err.response.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "No se encontró email registrado en Arequipet.",
                });
            } else {
                Swal.fire({
                    timer: 2000,
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'Error',
                    text: "Ocurrió al solicitar el cambio de contraseña solicite el cambio nuevamente, si el problema persiste contacte a los administradores.",
                });
            }

        });
    }

    return (
        <div>
            <div>
                <Formik
                    validationSchema={schema}
                    initialValues={{ email: "" }}
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
                                        Cambio de contraseña
                                    </span>
                                    
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        placeholder="Correo"
                                        className="form-control inp_text"
                                        id="email"
                                    />
                                    <p className="error">
                                        {errors.email && touched.email && errors.email}
                                    </p>

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