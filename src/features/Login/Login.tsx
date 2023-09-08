import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "app/store";
import { FormikHelpers, useFormik } from "formik";
import { Navigate } from "react-router-dom";
import { authThunks } from "./auth/auth-reducer";
import { BaseResponseType } from "common/api/todolists-api";

type ErrorFormikType = {
  email?: string;
  password?: string;
};
export type FormType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: ErrorFormikType = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 4) {
        errors.password = "Must be more 3 symbols";
      }

      return errors;
    },
    onSubmit: (values: FormType, formikHelpers: FormikHelpers<{ email: string; password: string; rememberMe: boolean; }>) => {
      dispatch(authThunks.login(values))
      .unwrap()
      .then( (res)=> {
        debugger
      })
      .catch( (e:BaseResponseType) => {
        debugger
        formikHelpers.setFieldError(e.fieldsErrors[0]?.field, e.fieldsErrors[0]?.error)
      } )

    },
  });
  if (isLoggedIn) return <Navigate to={"/"} />;

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a target="_blank" href={"https://social-network.samuraijs.com/"}>
                {" "}
                here
              </a>
            </p>

            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField
                type="email"
                label="Email"
                margin="normal"
                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                error={!!formik.touched.email && !!formik.errors.email}
                {...formik.getFieldProps("email")}
              />
              <TextField
                type="password"
                label="Password"
                margin="normal"
                helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                error={!!formik.touched.password && !!formik.errors.password}
                {...formik.getFieldProps("password")}
              />
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox checked={formik.values.rememberMe} />}
                {...formik.getFieldProps("rememberMe")}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  );
};
