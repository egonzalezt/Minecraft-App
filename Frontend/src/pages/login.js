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
import { useTranslation } from 'react-i18next';

function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const addUser = storeData(state => state.addUser);
    const passLength = {min: 8, max: 100}
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(t("auth.validators.requiredEmail"))
            .email(t("auth.validators.invalidEmail")),
        password: Yup.string()
            .required(t("auth.validators.requiredPassword"))
            .min(passLength.min, t("auth.validators.passwordMinLength",{min: passLength.min}))
            .max(passLength.max, t("auth.validators.passwordMaxLength",{max: passLength.max})),
    });
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
                    title: t("auth.successLogin"),
                    text: t("auth.welcomeMessage",{nickName: res.data.userNickName}),
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
                title: t("commons.error"),
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
                                        </IconButton>{t("auth.loginTitle")}
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        placeholder={t("auth.email")}
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
                                        placeholder={t("auth.password")}
                                        className="form-control"
                                    />
                                    <p className="error">
                                        {errors.password && touched.password && errors.password}
                                    </p>
                                    <button type="submit">{t("auth.loginTitle")}</button>
                                </form>
                                <br />
                                <p>
                                    <Link style={{ textDecoration: "underline", color: "blue" }} to="/signup">{t("auth.createAccount")}</Link>
                                </p>
                                <p>
                                    <Link style={{ textDecoration: "underline", color: "blue" }} to="/requestpasswordreset">{t("auth.forgotPassword")}</Link>
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
