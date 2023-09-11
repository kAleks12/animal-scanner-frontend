import {Container, DefaultHeader, InnerContainer} from "../commons";
import {ParagraphMedium} from "baseui/typography";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Confirmation = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state === null) {
            navigate("/login");
        }
    }, [state, navigate]);

    return (
        <Container>
            <InnerContainer>
                <DefaultHeader>{state?.header}</DefaultHeader>
                <ParagraphMedium>
                    {state?.msg} {state?.email}
                </ParagraphMedium>
            </InnerContainer>
        </Container>
    );
};

export {Confirmation};