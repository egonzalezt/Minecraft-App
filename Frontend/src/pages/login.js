import Footer from "../components/footer";
import { Formik } from 'formik'
import * as Yup from "yup";
import '../styles/login.css'
import UserApi from '../services/users'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { storeData } from '../states/stores'
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const schema = Yup.object().shape({
    email: Yup.string()
        .required("El correo es requerido")
        .email("Correo invalido"),
    password: Yup.string()
        .required("La contraseña es requerida")
        .min(8, "Contraseña debe tener al menos 8 caracteres")
        .max(100, "Contraseña debe tener maximo 50 caracteres"),
});

function Login() {

    const navigate = useNavigate();
    const addUser = storeData(state => state.addUser);
    function submit(data) {
        UserApi.login(data).then(res => {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            UserApi.verify().then(res => {
                addUser(res.data);
            }).then(() => {
                Swal.fire({
                    timer: 1000,
                    timerProgressBar: true,
                    icon: 'success',
                    title: `Inicio de sesion exitoso`,
                    text: `Bienvenido ${res.data.userNickName} a arequipet.ga`,
                }).then(() => {
                    navigate("/dashboard");
                    window.location.reload();
                });
            })
        }).catch(err => {
            Swal.fire({
                timer: 2000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error',
                text: err.response.data.message,
            })
        });
    }

    return (
        <div>
            <div>
                <Formik
                    validationSchema={schema}
                    initialValues={{ email: "", password: "" }}
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
                                        </IconButton>Ingresar
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
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        placeholder="Contraseña"
                                        className="form-control"
                                    />
                                    <p className="error">
                                        {errors.password && touched.password && errors.password}
                                    </p>
                                    <button type="submit">Ingresar</button>
                                </form>
                                <br />
                                <p>
                                    <Link style={{ textDecoration: "underline", color: "blue" }} to="/signup">¿No tienes cuenta? Registrate</Link>
                                </p>
                                <p>
                                    <Link style={{ textDecoration: "underline", color: "blue" }} to="/requestpasswordreset">¿Olvidaste la contraseña?</Link>
                                </p>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>

            <Footer />
        </div>
    );
}

export default Login;
