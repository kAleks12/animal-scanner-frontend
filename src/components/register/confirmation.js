import {Container, DefaultHeader, InnerContainer} from "../commons";
import {ParagraphMedium} from "baseui/typography";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Confirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state === null) {
            navigate("/login");
        }
    }, [state, navigate]);

    return (
        <Container>
            <InnerContainer>
                <DefaultHeader>Thanks for creating a new account!</DefaultHeader>
                <ParagraphMedium>
                    Activation email has been sent to {state?.email}
                </ParagraphMedium>
            </InnerContainer>
        </Container>
    );
};

export {Confirmation};