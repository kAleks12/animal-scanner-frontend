import * as React from "react";
import {useState} from "react";
import {AppNavBar, setItemActive} from "baseui/app-nav-bar";
import useAuth from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";

import {FaSignOutAlt} from "react-icons/fa";
import axios from "../../api/axios";

const Navbar = () => {
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();
    const [mainItems, setMainItems] = useState([
        {label: "Home"},
    ]);

    const [userItems] = useState([
        {icon: FaSignOutAlt, label: "Logout"}
    ]);

    const [authItems] = useState([
        {label: "Login"},
        {label: "Register"}
    ]);


    const handleMainItemsChange = (item) => {
        setMainItems(prev => setItemActive(prev, item));
        if (item?.label === "Home") {
            navigate("/");
        }
    }

    const handleUserItemsChange = async (item) => {
        if (item?.label === "Logout") {
            console.log(auth.refreshToken);
            await axios.post("/auth/logout", null,{
                headers: {
                    "Authorization": `Bearer ${auth.refreshToken}`
                }
            });
            console.log("logout");
            setAuth({});
            navigate("/login");
        }
    }

    const handleAuthItemsChange = (item) => {
        setMainItems(prev => setItemActive(prev, item));
        if (item?.label === "Login") {
            navigate("/login");
        }
        else if (item?.label === "Register") {
            navigate("/register");
        }
    }

    return (
        auth?.user ? (
            <div className="navbar">
                <AppNavBar
                    title={
                        <span className="logo-wrapper">
                         <img className="logo-text" src="./animal_scanner.png" alt="Animal scanner"/>
                        </span>
                    }
                    mainItems={mainItems}
                    onMainItemSelect={item => handleMainItemsChange(item)}
                    username={auth.user}
                    userItems={userItems}
                    onUserItemSelect={item => handleUserItemsChange(item)}
                />
            </div>
        ) : (
            <div className="navbar">
                <AppNavBar
                    title="Animal Scanner"
                    mainItems={authItems}
                    onMainItemSelect={handleAuthItemsChange}
                />
            </div>
        )
    );
}

export default Navbar;