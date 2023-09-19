import {useNavigate} from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import {useContext, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import "./home.css";
import {
    Container,
    HomeWrapper,
    InnerContainer,
    SearchInputWrapper,
    SearchWrapper,
    StyledInput,
    StyledSelect
} from "../commons";
import {Button} from "baseui/button";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import {toast, ToastContainer} from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {Select, TYPE} from "baseui/select";

function Home() {
    const [search, setSearch] = useState("");
    const axiosPrivate = useAxiosPrivate()
    const [center, setCenter] = useState([51.1089776, 17.0326689]);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([]);

    const fetchOptions = async () => {
        try {
            if (search.length < 3) {
                toast("Enter more than 3 characters")
                return;
            }
            const response = await toast.promise(
                axiosPrivate.get("/search", {params: {'query': search}}),
                {
                    pending: 'Loading search results',
                    success: 'Search results loaded',
                }
            );

            setItems(response.data)
        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                toast.error("Connection to server failed");
            } else if (err.response?.status === 400) {
                toast.error("Invalid credentials");
            } else if (err.response?.status === 500) {
                toast.error("Server error, try again later");
            } else {
                toast.error("Unknown error");
            }
        }
    };


    const handleOnSelect = (item) => {
        setValue(item.value)
        if (item.option !== null) {
            setCenter([item.option.value.x, item.option.value.y])
        }
    };

    function ChangeView({center}) {
        const map = useMap();
        map.setView(center, 13);
        return null;
    }


    const markers = [[51.1089776, 17.0326689], [51.1089778, 17.0326689], [51.1089779, 17.0326689]];
    return (
        <>
            <Container>
                <HomeWrapper>
                    <MapContainer className="map" scrollWheelZoom={false}>
                        <ChangeView center={center}/>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MarkerClusterGroup>
                            <Marker position={[49.8397, 24.0297]}>
                                <Popup>
                                    <Button size="large" kind="primary">
                                        See submission
                                    </Button>
                                </Popup>
                            </Marker>
                            <Marker position={[52.2297, 21.0122]}/>
                            <Marker position={[51.5074, -0.0901]}/>
                        </MarkerClusterGroup>
                    </MapContainer>

                    <SearchWrapper>
                        <SearchInputWrapper>
                            <StyledInput
                                name="user"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for a place"
                                clearOnEscape
                                size="large"
                                type="text"
                            />
                            <Button size="large" kind="primary" onClick={fetchOptions}>
                                Search
                            </Button>
                        </SearchInputWrapper>

                        <div className="select">
                            <Select
                                className="select"
                                options={items}
                                labelKey="label"
                                valueKey="value"
                                onChange={handleOnSelect}
                                value={value}
                                maxDropdownHeight="300px"
                                type={TYPE.search}
                                placeholder="Pick result"
                            />
                        </div>
                    </SearchWrapper>


                </HomeWrapper>
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
}

export {Home};
