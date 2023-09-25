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
import { useState, Fragment } from 'react';
import Stack from '@mui/material/Stack';
import RadioButtonCheckedTwoToneIcon from '@mui/icons-material/RadioButtonCheckedTwoTone';
import RadioButtonUncheckedTwoToneIcon from '@mui/icons-material/RadioButtonUncheckedTwoTone';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

function App() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isRequired, setRequired] = useState(false);
    const [isMinLength, setMinLength] = useState(false);
    const [isUppercase, setUppercase] = useState(false);
    const [isMaxLength, setMaxLength] = useState(false);
    const [isLowercase, setLowercase] = useState(false);
    const [isSpecial, setSpecial] = useState(false);
    const [isNumber, setNumber] = useState(false);
    const nickNameRanges = {min: 4, max: 50}
    const passLength = {min: 8, max: 100}

    const schema = Yup.object().shape({
        nickName: Yup.string()
            .min(nickNameRanges.min, t("auth.validators.nickNameMinLength",{min: nickNameRanges.min}))
            .max(nickNameRanges.max, t("auth.validators.nickNameMaxLength",{max: nickNameRanges.max}))
            .required(t("auth.validators.requiredNickName")),
        email: Yup.string()
            .required(t("auth.validators.requiredEmail"))
            .email(t("auth.validators.invalidEmail")),
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
            if (!(/[@$!%*#?&.,ñ/\-_]+/.test(password))) {
                setSpecial(false)
                return field.matches(/[@$!%*#?&.,ñ/\-_]+/)
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
        UserApi.signup(data).then(res => {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                title: t("auth.accountCreatedMessage"),
                text: t("auth.welcomeMessage",{nickName: data.nickName})
            }).then(() => navigate("/login"));
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
                                        </IconButton>
                                        {t("auth.signUpTitle")}
                                    </span>
                                    <input
                                        type="nickName"
                                        name="nickName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.nickName}
                                        placeholder={t("auth.nickName")}
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
                                        placeholder={t("auth.email")}
                                        className="form-control inp_text"
                                        id="email"
                                    />
                                    <p className="error">
                                        {errors.email && touched.email && errors.email}
                                    </p>
                                    <Tooltip title={
                                        <Fragment>
                                            <Stack direction='column' width="100%" spacing={2} justifyContent="flex-start" alignItems="flex-start" paddingBottom={2}>
                                                <Typography fontSize={12}>
                                                    {(isMinLength && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} {t("auth.validators.passwordMinLength",{min: passLength.min})}
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isUppercase && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} {t("auth.validators.passwordUpper")}
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isMaxLength && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} {t("auth.validators.passwordMaxLength",{max: passLength.max})}
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isLowercase && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} {t("auth.validators.passwordLower")}
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isSpecial && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} {t("auth.validators.passwordSymbol")}
                                                </Typography>
                                                <Typography fontSize={12}>
                                                    {(isNumber && isRequired) ? <RadioButtonCheckedTwoToneIcon sx={{ fontSize: 15, color: "green" }} /> : <RadioButtonUncheckedTwoToneIcon sx={{ fontSize: 15, color: "red" }} />} {t("auth.validators.passwordNumber")}
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
                                            placeholder={t("auth.password")}
                                            className="form-control"
                                        />
                                    </Tooltip>
                                    <button type="submit">{t("auth.signUpTitleBtn")}</button>
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