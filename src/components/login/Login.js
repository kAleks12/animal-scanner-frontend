import {Button} from "baseui/button";
import {HeadingXXLarge,} from "baseui/typography";
import {
    Container,
    DefaultLink,
    FormButtonWrapper,
    InnerContainer,
    InputWrapper,
    ResetPasswordContainer,
    StyledInput,
} from "../commons";

import {useFormik} from "formik";
import axiosPrivate from "../../api/axios";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LOGIN_URL = 'auth/login';

function Login() {
    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";


    const onSubmit = async (values) => {
        try {
            const {user, password} = values;
            const response = await axiosPrivate.post(LOGIN_URL,
                JSON.stringify({user, password})
            );

            const accessToken = response?.data?.access_token;
            setAuth({user, password, accessToken});
            navigate(from, {replace: true});
        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                toast.error("Connection to server failed");
            } else if (err.response?.status === 403) {
                toast.error("Invalid credentials");
            } else if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else {
                toast.error("Unknown error");
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            user: "",
            password: "",
        },
        onSubmit,
    });


    return (
        <>
            <Container>
                <InnerContainer>
                    <form onSubmit={formik.handleSubmit}>
                        <HeadingXXLarge>Welcome Back!</HeadingXXLarge>
                        <InputWrapper>
                            <StyledInput
                                name="user"
                                value={formik.values.user}
                                onChange={formik.handleChange}
                                placeholder="Username"
                                clearOnEscape
                                size="large"
                                type="text"
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <StyledInput
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                placeholder="Password"
                                clearOnEscape
                                size="large"
                                type="password"
                            />
                        </InputWrapper>
                        <FormButtonWrapper>
                            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
                                Login
                            </Button>
                            <DefaultLink to="/register">No account yet?</DefaultLink>
                        </FormButtonWrapper>
                        <ResetPasswordContainer>
                            <DefaultLink to="/reset-password">Forgot password?</DefaultLink>
                        </ResetPasswordContainer>
                    </form>
                </InnerContainer>
            </Container>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="dark"
            />
        </>
    );
}

export {Login};
