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
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const PASSWORD_REGEX =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

function Register() {
    const [error, setError] = useState("");
    const [validPassword, setValidPwd] = useState(false);
    const [validMatch, setValidMatch] = useState(false);

    const onSubmit = async (values) => {
        setError("");
        if (!validPassword) {
            setError("Password must contain one special character, one upper case letter, one number and have at least 8 characters");
            return;
        }
        if (!validMatch) {
            setError("Passwords do not match");
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
            repeatPassword: "",
        },
        onSubmit,
    });

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(formik.values.password));
        setValidMatch(formik.values.password === formik.values.repeatPassword);
    }, [formik.values.password, formik.values.repeatPassword])

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
