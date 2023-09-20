import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import "./Home.css";
import {Container, SearchInputWrapper, SearchWrapper, StyledInput} from "../commons";
import {Button} from "baseui/button";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import {toast, ToastContainer} from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {Select, TYPE} from "baseui/select";
import {ANCHOR, Drawer} from "baseui/drawer";
import SubmissionCard from "./SubmissionCard";

function Home() {
    const axiosPrivate = useAxiosPrivate()
    const [center, setCenter] = useState([51.1089776, 17.0326689]);

    // search states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectVal, setSelectVal] = useState([]);
    const [searchItems, setSearchItems] = useState([]);

    // drawer states
    const [isOpen, setIsOpen] = useState(false);
    const [formBody, setFormBody] = useState({});
    const [formImage, setFormImage] = useState(null);

    // marker state
    const [subPoints, setSubPoints] = useState([]);

    const popupElRef = useRef(null);
    const hideElement = () => {
        if (!popupElRef.current) return;
        popupElRef.current.close();
    };

    useEffect(() => {
        axiosPrivate.get('/submission')
            .then(response => setSubPoints(response.data))
            .catch(err => {
                if (err?.code === "ERR_NETWORK") {
                    toast.error("Connection to server failed");
                } else if (err.response?.status === 400) {
                    toast.error("Invalid credentials");
                } else if (err.response?.status === 500) {
                    toast.error("Server error, try again later");
                } else {
                    toast.error("Unknown error");
                }
            });
    }, [axiosPrivate]);

    const fetchSubmission = async (subId) => {
        try {
            const response = await axiosPrivate.get(`/submission/${subId}`);
            setFormBody(response.data);
            const photoResponse = await axiosPrivate.get(`/submission/${subId}/photo`, {responseType: 'blob'});
            const imageUrl = URL.createObjectURL(photoResponse.data);
            setFormImage(imageUrl);
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
    }

    const fetchOptions = async () => {
        try {
            if (searchQuery.length < 3) {
                toast("Enter more than 3 characters")
                return;
            }
            const response = await toast.promise(
                axiosPrivate.get("/search", {params: {'query': searchQuery}}),
                {
                    pending: 'Loading search results',
                    success: 'Search results loaded',
                }
            );

            setSearchItems(response.data)
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
        setSelectVal(item.value)
        if (item.option !== null) {
            setCenter([item.option.value.x, item.option.value.y])
        }
    };

    function ChangeView({center}) {
        const map = useMap();
        if (center === null || center === undefined) {
            return;
        }

        if (map.getZoom() === undefined) {
            map.setView(center, 13);
        } else {
            map.flyTo(center, map.getZoom())
        }
    }

    const drawerOnCloseHandler = () => {
        setIsOpen(false);
        setFormImage(null);
        setFormBody(null);
    }


    return (
        <>
            <Container>
                <SearchWrapper>
                    <SearchInputWrapper>
                        <StyledInput
                            name="user"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                            options={searchItems}
                            labelKey="label"
                            valueKey="value"
                            onChange={handleOnSelect}
                            value={selectVal}
                            maxDropdownHeight="300px"
                            type={TYPE.search}
                            placeholder="Pick result"
                        />
                    </div>
                </SearchWrapper>

                <MapContainer className="map" scrollWheelZoom={false}>
                    <ChangeView center={center}/>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MarkerClusterGroup>
                        {subPoints.map((point, index) => (
                            <Marker key={index} position={[point.x, point.y]}>
                                <Popup ref={popupElRef}>
                                    <Button size="large" kind="primary"
                                            onClick={async () => {
                                                hideElement();
                                                setCenter([point.x, point.y]);
                                                await fetchSubmission(point.id);
                                                setIsOpen(true);
                                            }}>
                                        See submission
                                    </Button>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                </MapContainer>
            </Container>

            <Drawer
                isOpen={isOpen}
                autoFocus
                onClose={drawerOnCloseHandler}
                anchor={ANCHOR.right}
            >
                <SubmissionCard form={formBody} image={formImage}/>
            </Drawer>

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