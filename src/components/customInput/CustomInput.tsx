import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

type Props = {
  inital: object;
  schema: Yup.ObjectShape;
  onSubmit: (values: any, setSubmitting: any) => any;
};

const CustomInput = ({ inital, schema, onSubmit }: Props) => {
  return (
    <Formik
      initialValues={inital}
      validationSchema={Yup.object(schema)}
      onSubmit={(values, { setSubmitting }) =>
        onSubmit(values, { setSubmitting })
      }
    >
      <Form className="form">
        <Field
          className="form__input"
          name="phone"
          type="text"
          placeholder="Phone number, +7 (***) ***  ** **"
        />
        <ErrorMessage name="phone" />
      </Form>
    </Formik>
  );
};

export default CustomInput;
