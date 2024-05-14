import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../../app/service/auth";
import * as Yup from "yup";

import { CustomError } from "../../components/errorMessage/ErrorMessage";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import "../Login/Form.scss";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

const Register = () => {
  const [registerUser] = useRegisterMutation();
  const [login] = useLoginMutation();

  const [error, setError] = useState();

  const navigate = useNavigate();

  const register = async (data) => {
    try {
      await registerUser(data).unwrap();
      await login({ phone: data.phone, password: data.password }).unwrap();
      navigate("/");
    } catch (error) {
      if (error.data.message) {
        setError(error.data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div className="form__wrapper">
      <Formik
        initialValues={{
          name: "",
          nickname: "",
          phone: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .required("Обязательное поле")
            .min(1, "Имя не может быть короче 1 символа"),
          nickname: Yup.string()
            .min(1, "Никнейм не может быть короче 1 символа")
            .notRequired(),
          phone: Yup.string()
            .max(12, 'Номер телефона должен составлять 11 символов включая "+"')
            .min(12, 'Номер телефона должен составлять 11 символов включая "+"')
            .required("Обязательное поле")
            .matches(
              /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
              "Не корректный номер телефона"
            ),
          password: Yup.string()
            .required("Обязательное поле")
            .min(6, "Минимальная длина пароля 6 символов"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Пароли не совпадают")
            .min(6, "Минимальная длина пароля 6 символов")
            .required("Обязательное поле"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          register(values);
          setSubmitting(true);
        }}
      >
        <Form className="form">
          <Logo className="form__logo" />
          <span className="form__text">Create your account</span>
          <div className="form__inner">
            <Field
              className="form__input"
              name="name"
              type="text"
              placeholder="Enter your name"
            />
            <span className="form__errormessage">
              <ErrorMessage name="name" />
            </span>

            <Field
              className="form__input"
              name="nickname"
              type="text"
              placeholder="Enter your nickname"
            />
            <span className="form__errormessage">
              <ErrorMessage name="nickname" />
            </span>

            <Field
              className="form__input"
              name="phone"
              type="text"
              placeholder="Phone number, +7 (***) ***  ** **"
            />
            <span className="form__errormessage">
              <ErrorMessage name="phone" />
            </span>

            <Field
              className="form__input"
              placeholder="Password"
              name="password"
              type="password"
            />
            <span className="form__errormessage">
              <ErrorMessage name="password" />
            </span>

            <Field
              className="form__input"
              placeholder="Password"
              name="confirmPassword"
              type="password"
            />
            <span className="form__errormessage">
              <ErrorMessage name="confirmPassword" />
            </span>

            <button className="form__btn" type="submit">
              Sign Up
            </button>
          </div>
          <ErrorBoundary>
            <CustomError message={error} />
          </ErrorBoundary>
          <span className="form__divider">OR</span>
          <span className="form__signin">
            Allready have an account? <Link to="/Login">Log in</Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
