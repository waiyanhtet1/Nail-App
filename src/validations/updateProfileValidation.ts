import * as yup from "yup";

export const updateProfileValidation = yup
  .object({
    userName: yup.string().required("UserName is required"),
    phone: yup
      .string()
      .required("Phone is required")
      .min(6, "Phone number must be at least 6 characters")
      .max(15, "Phone number must be at most 15 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid Email Format"),
    // profileImg: yup.mixed().required("Profile image is required"),
  })
  .required();
