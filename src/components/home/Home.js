import axios from "axios";
import {Button} from "baseui/button";
import {HeadingXXLarge} from "baseui/typography";
import {useNavigate} from "react-router-dom";
import {Container} from "../commons";
import AuthContext from "../../context/AuthProvider";
import {useContext} from "react";


function Home() {
    const navigate = useNavigate();
    const {setAuth} = useContext(AuthContext);
    const logout = () => {
        setAuth({});
        navigate("/")
    };

    const getPayment = async () => {
        const response = await axios.get("http://localhost:9000/api/v1/payment", {
            withCredentials: true,
        });
        console.log("Response: ", response);
    };

    return (
        <Container>
            <HeadingXXLarge color="secondary500">Welcome Home Bud!</HeadingXXLarge>
            <Button kind="secondary" onClick={getPayment}>
                Get Payment
            </Button>
            <Button kind="secondary" onClick={logout}>
                Logout
            </Button>
        </Container>
    );
}

export {Home};
