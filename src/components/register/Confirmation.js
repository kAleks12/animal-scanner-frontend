import {ContainerForNavbar, DefaultHeader, InnerContainer} from "../styles";
import {ParagraphMedium} from "baseui/typography";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Navbar from "../navbar/Navbar";
import "../navbar/Navbar.css"

const Confirmation = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state === null) {
            navigate("/login");
        }
    }, [state, navigate]);

    return (
        <>
            <Navbar/>
            <ContainerForNavbar className="big-navbar-gap">
                <InnerContainer>
                    <DefaultHeader>{state?.header}</DefaultHeader>
                    <ParagraphMedium>
                        {state?.msg} {state?.email}
                    </ParagraphMedium>
                </InnerContainer>
            </ContainerForNavbar>
        </>
    );
};

export {Confirmation};