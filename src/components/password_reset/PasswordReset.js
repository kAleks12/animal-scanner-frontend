import {ContainerForNavbar, FormButtonWrapper, InnerContainer, InputWrapper, StyledInput} from "../styles";
import {useNavigate} from "react-router-dom";
import axiosPrivate from "../../api/axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Button} from "baseui/button";
import {useFormik} from "formik";
import {HeadingXXLarge, ParagraphMedium} from "baseui/typography";
import Navbar from "../navbar/Navbar";
import "../navbar/Navbar.css"

const ResetPassword = () => {
    const navigate = useNavigate()
    const onSubmit = async (values) => {
        try {
            await axiosPrivate.post(
                "/auth/reset-password",
                null,
                {params: {email: values.email}}
            );
            navigate("/confirmation", {
                state: {
                    email: values.email,
                    header: "Your request is being processed!",
                    msg: "Password reset link has been sent to"
                }
            });
        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                toast.error("Connection to server failed");
            } else if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else if (err.response?.status === 404) {
                toast.error("Account does not exist");
            } else {
                toast.error("Unknown error");
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit,
    });

    return (
        <>
            <Navbar/>
            <ContainerForNavbar className="big-navbar-gap">
                <InnerContainer>
                    <form onSubmit={formik.handleSubmit}>
                        <HeadingXXLarge>Account password reset request</HeadingXXLarge>
                        <ParagraphMedium>Enter your account email to receive a password reset link</ParagraphMedium>
                        <InputWrapper>
                            <StyledInput
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="Account email"
                                clearOnEscape
                                size="large"
                                type="email"
                            />
                        </InputWrapper>
                        <FormButtonWrapper>
                            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
                                Send request
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

export {ResetPassword};