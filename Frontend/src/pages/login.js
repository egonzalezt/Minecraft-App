import Footer from "../components/footer";
import { Formik } from 'formik'
import * as Yup from "yup";
import '../styles/login.css'
import UserApi from '../services/users'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import {storeData} from '../states/stores'
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
            UserApi.verify().then(res =>{
                addUser(res.data);
            }).then(()=>{
                Swal.fire({
                    timer: 1000,
                    timerProgressBar: true,
                    icon: 'success',
                    title: `Inicio de sesion exitoso`,
                    text: `Bienvenido ${res.data.userNickName} a arequipet.ga`,
                }).then(()=> navigate("/"));
            })
        }).catch(err => {
            Swal.fire({
                timer: 2000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Error',
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
                                {/* Passing handleSubmit parameter tohtml form onSubmit property */}
                                <form noValidate onSubmit={handleSubmit}>
                                    <span>Ingresar</span>
                                    {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
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
                                    {/* If validation is not passed show errors */}
                                    <p className="error">
                                        {errors.email && touched.email && errors.email}
                                    </p>
                                    {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        placeholder="Contraseña"
                                        className="form-control"
                                    />
                                    {/* If validation is not passed show errors */}
                                    <p className="error">
                                        {errors.password && touched.password && errors.password}
                                    </p>
                                    {/* Click on submit button to submit the form */}
                                    <button type="submit">Ingresar</button>
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

export default Login;
