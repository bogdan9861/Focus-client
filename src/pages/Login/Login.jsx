import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import * as Yup from "yup";

import { useLoginMutation } from "../../app/service/auth";
import { CustomError } from "../../components/errorMessage/ErrorMessage";

import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import "./Form.scss";

const Login = () => {
  const [loginUser] = useLoginMutation();

  const [error, setError] = useState();

  const navigate = useNavigate();

  const login = async (data) => {
    try {
      await loginUser(data).unwrap();
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
        initialValues={{ phone: "", password: "" }}
        validationSchema={Yup.object({
          phone: Yup.string()
            .required("Обязательное поле")
            .max(12, 'Номер телефона должен составлять 11 символов включая "+"')
            .min(12, 'Номер телефона должен составлять 11 символов включая "+"')
            .matches(
              /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
              "Не корректный номер телефона"
            ),
          password: Yup.string()
            .required("Обязательное поле")
            .min(6, "Пароль должен быть длиннее 5 символов"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          login(values);
          setSubmitting(true);
        }}
      >
        <Form className="form">
          <Logo className="form__logo" />
          <span className="form__text">Login to continue</span>
          <div className="form__inner">
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

            <button className="form__btn" type="submit">
              Log In
            </button>
          </div>

          <ErrorBoundary>
            <CustomError message={error} />
          </ErrorBoundary>

          <span className="form__divider">OR</span>
          <a className="form__password-reset" href="#">
            Forget password?
          </a>
          <span className="form__signin">
            Don't have an account? <Link to="/register">Sign up</Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
