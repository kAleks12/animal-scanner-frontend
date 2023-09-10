import {Button} from "baseui/button";
import {HeadingXXLarge,} from "baseui/typography";
import {Container, FormButtonWrapper, InnerContainer, InputWrapper, StyledInput,} from "../commons";

import {useFormik} from "formik";
import axios from "../../api/axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
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
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({user, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.access_token;
            setAuth({user, password, accessToken});
            navigate(from, {replace: true});
        } catch (err) {
            if (!err?.response) {
                toast.error("Connection to server failed")
            } else if (err.response?.status === 403) {
                toast.error("Invalid credentials")
            } else if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else {
                toast.error("Connection to server failed");
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
                            <Link to="/register">No account yet?</Link>
                        </FormButtonWrapper>
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
