import {Container, DefaultHeader, InnerContainer} from "../commons";
import {ParagraphMedium} from "baseui/typography";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import axiosPrivate from "../../api/axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Activation = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")
    const [success, setSuccess] = useState(null);

    const activate = useCallback(async () => {
        try {
            await axiosPrivate.post("/auth/activate", null, {
                headers: {Authorization: "Bearer " + token},
            });
            setSuccess(true);
        } catch (err) {

            if (err?.code === "ERR_NETWORK") {
                toast.error("Connection to server failed");
            } else if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else {
                toast.error("Unknown error");
            }
            setSuccess(false)
        }
    }, [token]);

    useEffect(() => {
        if (token === null) {
            navigate("/login");
            return;
        }
        activate();
    }, [activate, token, navigate])


    const getBody = () => {
        if (success === null) {
            return (
                <InnerContainer>
                    <DefaultHeader>Waiting for server's response!</DefaultHeader>
                    <ParagraphMedium>
                        Please wait while we activate your account...
                    </ParagraphMedium>
                </InnerContainer>
            )
        } else if (success === true) {
            return (
                <InnerContainer>
                    <DefaultHeader>You are all set!</DefaultHeader>
                    <ParagraphMedium>
                        Your account has been activated.
                    </ParagraphMedium>
                </InnerContainer>
            )
        } else {
            return (
                <InnerContainer>
                    <DefaultHeader>Account activation failed!</DefaultHeader>
                    <ParagraphMedium>
                        Please try again later with the same activation link.
                    </ParagraphMedium>
                </InnerContainer>
            )
        }
    }

    return (
        <>
            <Container>
                {getBody()}
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
    )
};

export {Activation};