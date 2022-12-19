import '../styles/login.css'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Footer from "../components/footer";
import Swal from 'sweetalert2'
import UserApi from '../services/users'
import { useNavigate } from "react-router-dom";

// Creating schema
const schema = Yup.object().shape({
    nickName: Yup.string()
        .min(4, "El nombre de usuario requiere minimo 4 caracteres")
        .max(50, "El nombre de usuario requiere maximo 50 caracteres")
        .required("El nombre de usuario es requerido"),
        email: Yup.string()
        .required("El correo es requerido")
        .email("Correo invalido"),
    password: Yup.string()
        .required("La contraseña es requerida")
        .min(8, "Contraseña debe tener al menos 8 caracteres")
        .max(100, "Contraseña debe tener maximo 50 caracteres"),
});

function App() {
    const navigate = useNavigate();

    function submit(data){
        UserApi.signup(data).then(res => {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,           
                icon: 'success',    
                title: `Cuenta registrada`, 
                text: `Bienvenid@ ${data.nickName} a arequipet.ga`,          
            }).then(()=>navigate("/login"));
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
                                    <span>Registro</span>
                                    <input
                                        type="nickName"
                                        name="nickName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.nickName}
                                        placeholder="Apodo"
                                        className="form-control inp_text"
                                        id="nickName"
                                    />

                                    <p className="error">
                                        {errors.nickName && touched.nickName && errors.nickName}
                                    </p>

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
                                    <p className="error">
                                        {errors.password && touched.password && errors.password}
                                    </p>

                                    <button type="submit">Registrarse</button>
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