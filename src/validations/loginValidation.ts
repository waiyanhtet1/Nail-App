import * as yup from "yup";

export const loginValidationSchema = yup
  .object({
    userName: yup.string().required("UserName is required"),
    password: yup.string().required("Password is required"),
  })
  .required();
