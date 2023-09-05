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

import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useState} from "react";
import {Link} from "react-router-dom";

function Register() {
    const [error, setError] = useState("");
    const onSubmit = async (values: any) => {
        setError("");

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
            username: "",
            email: "",
            password: "",
        },
        onSubmit,
    });

    return (
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
                        <ErrorText>{error}</ErrorText>
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
    );
}

export {Register};
