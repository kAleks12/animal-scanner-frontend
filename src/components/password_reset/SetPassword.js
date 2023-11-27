import {ContainerForNavbar, FormButtonWrapper, InnerContainer, InputWrapper, StyledInput} from "../styles";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosPrivate from "../../api/axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Button} from "baseui/button";
import {useFormik} from "formik";
import {HeadingXXLarge} from "baseui/typography";
import Navbar from "../navbar/Navbar";
import "../navbar/Navbar.css"

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


const SetPassword = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")
    const [validPassword, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const onSubmit = async (values) => {
        if (!validMatch) {
            toast.error("Passwords must match");
            return;
        }
        if (!validPassword) {
            toast.error("Password must contain one special character, one upper case letter, one number and have at least 8 characters");
            return;
        }

        try {
            await axiosPrivate.post(
                "/auth/set-password",
                null,
                {
                    headers: {Authorization: "Bearer " + token},
                    params: {new_password: values.password}
                }
            );
            toast.success("Password was updated successfully", {autoClose: false});
            await new Promise(r => setTimeout(r, 3000));
            navigate("/login");

        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                toast.error("Connection to server failed");
            } else if (err.response?.status === 409) {
                toast.error("Password is already in use");
            } else if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else if (err.response?.status === 400) {
                toast.error("Reset token has either expired or has been used");
            } else {
                toast.error("Unknown error");
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            password: "",
            repeatPassword: "",
        },
        onSubmit,
    });

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(formik.values.password));
        setValidMatch(formik.values.password === formik.values.repeatPassword);
    }, [formik.values.password, formik.values.repeatPassword]);

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        }
    }, [token, navigate])

    return (
        <>
            <Navbar/>
            <ContainerForNavbar className="big-navbar-gap">
                <InnerContainer>
                    <HeadingXXLarge>Set new password!</HeadingXXLarge>
                    <form onSubmit={formik.handleSubmit}>
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
                                Reset password
                            </Button>
                        </FormButtonWrapper>
                    </form>
                </InnerContainer>
            </ContainerForNavbar>
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
    )
};

export {SetPassword};