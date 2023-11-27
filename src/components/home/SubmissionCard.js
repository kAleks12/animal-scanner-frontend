import * as React from "react";
import {FaRegCalendarAlt, FaTags, FaMapMarkerAlt, FaUser, FaEnvelope} from 'react-icons/fa';
import "./SubmissionCard.css"

const SubmissionCard = ({image, form}) => {
    if (form?.tags.length === 0) {
        form?.tags.push({value: "No tags provided"});
    }
    const description = form?.description || "No description provided";
    const username = form?.author?.username || "Account deleted";
    const email = form?.author?.email || "Account deleted";

    return (
        <div className='submission-container'>
            <img src={image} alt="Submitted animal" style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: "10px"}}/>
            <div style={{display: "flex", alignItems: "center", columnGap: "0.5rem"}}><FaRegCalendarAlt/> {form?.date}</div>
            <div style={{display: "flex", alignItems: "center", columnGap: "0.5rem"}}><FaMapMarkerAlt/> {form?.x}, {form?.y}</div>
            <div style={{display: "flex", alignItems: "center", columnGap: "0.5rem"}}><FaUser/> {username}</div>
            <div style={{display: "flex", alignItems: "center", columnGap: "0.5rem"}}><FaEnvelope/> {email} </div>
            <div>
                <FaTags/>
                {form?.tags.map((tag, index) => (
                    <span key={index} style={{
                        display: 'inline-block',
                        margin: '0.5rem',
                        padding: '10px',
                        background: '#1c1c1c',
                        borderRadius: '5px'
                    }}>{tag.value}</span>
                ))}
            </div>
            <h2>{description}</h2>
        </div>
    );
};

export default SubmissionCard;