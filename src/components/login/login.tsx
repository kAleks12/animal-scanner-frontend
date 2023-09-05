import {Button} from "baseui/button";
import {
    HeadingXXLarge,
} from "baseui/typography";
import {
    Container,
    ErrorText, FormButtonWrapper,
    InnerContainer,
    InputWrapper,
    StyledInput,
} from "../commons";

import {useSignIn} from "react-auth-kit";
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const [error, setError] = useState("");
    const signIn = useSignIn();
    const navigate = useNavigate()

    const onSubmit = async (values: any) => {
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/auth/login",
                {
                    "email": values.email,
                    "password": values.password
                }
            );

            signIn({
                token: response.data.session.access_token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: {email: values.email},
            });
            navigate("/");
        } catch (err) {
            if (err && err instanceof AxiosError) {
                setError(err.message);
            } else if (err && err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error occurred");
            }
        }

    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit,
    });

    return (
        <Container>
            <InnerContainer>
                <form onSubmit={formik.handleSubmit}>
                    <HeadingXXLarge>Welcome Back!</HeadingXXLarge>
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
                        <ErrorText>{error}</ErrorText>
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
    );
}

export {Login};
