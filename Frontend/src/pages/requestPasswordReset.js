import '../styles/login.css'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Footer from "../components/footer";
import Swal from 'sweetalert2'
import UserApi from '../services/users'
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTranslation } from 'react-i18next';

function App() {
    const { t } = useTranslation();
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(t("auth.validators.requiredEmail"))
            .email(t("auth.validators.invalidEmail")),
    });

    function submit(data) {
        const selectedLanguage = localStorage.getItem("selectedLanguage");
        const language = selectedLanguage !== null ? selectedLanguage : "es";
        data.lang = language;
        UserApi.requestPasswordReset(data).then(res => {
            Swal.fire({
                icon: 'success',
                title: t("auth.emailSent"),
                text: t("auth.emailSentDescription"),
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
                    text: t("auth.updatePasswordError"),
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
                                        {t("auth.changePassword")}
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

                                    <button type="submit">{t("commons.update")}</button>
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