import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Container, DefaultHeader, InnerContainer} from "../commons";
import {ParagraphMedium} from "baseui/typography";

const NewSubmission = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state === null) {
            navigate("/");
        }
    }, [state, navigate]);

    return (
        <Container>
            <InnerContainer>
                <DefaultHeader>New submission added</DefaultHeader>
                <ParagraphMedium>
                    {state?.position}
                </ParagraphMedium>
            </InnerContainer>
        </Container>
    );
};

export {NewSubmission};