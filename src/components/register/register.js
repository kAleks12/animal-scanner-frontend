import {Button} from "baseui/button";
import {
    HeadingXXLarge,
} from "baseui/typography";
import {
    Container,
    FormButtonWrapper,
    InnerContainer,
    InputWrapper,
    StyledInput,
} from "../commons";

import {useFormik} from "formik";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "../../api/axios";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

function Register() {
    const [validPassword, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const onSubmit = async (values) => {
        if (!validPassword) {
            toast.error("Password must contain one special character, one upper case letter, one number and have at least 8 characters")
            return;
        }
        if (!validMatch) {
            toast.error("Passwords must match")
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/v1/auth/register",
                {
                    "username": values.username,
                    "email": values.email,
                    "password": values.password
                }
            );

        } catch (err) {
            if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else if (err.response?.status === 400) {
                toast.error("Username is already taken");
            }
            else {
                toast.error("Connection to server failed");
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
        },
        onSubmit,
    });

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(formik.values.password));
        setValidMatch(formik.values.password === formik.values.repeatPassword);
    }, [formik.values.password, formik.values.repeatPassword])

    return (
        <>
            <Container>
                <InnerContainer>
                    <form onSubmit={formik.handleSubmit}>
                        <HeadingXXLarge>Pleased to meet you!</HeadingXXLarge>
                        <InputWrapper>
                            <StyledInput
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                placeholder="Username"
                                clearOnEscape
                                size="large"
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <StyledInput
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="Email"
                                clearOnEscape
                                size="large"
                                type="email"
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
                        <InputWrapper>
                            <StyledInput
                                name="repeatPassword"
                                value={formik.values.repeatPassword}
                                onChange={formik.handleChange}
                                placeholder="Repeat password"
                                clearOnEscape
                                size="large"
                                type="password"
                            />
                        </InputWrapper>
                        <FormButtonWrapper>
                            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
                                Sign up
                            </Button>
                            <Link to="/login">Already have an account?</Link>
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

export {Register};
