import * as React from "react";
import {FaRegCalendarAlt, FaTags, FaMapMarkerAlt, FaUser, FaEnvelope} from 'react-icons/fa';
import "./SubmissionCard.css"

const SubmissionCard = ({image, form}) => {
    if (form?.tags.length === 0) {
        form?.tags.push({value: "No tags provided"});
    }
    const description = form?.description || "No description provided";

    return (
        <div className='submission-container'>
            <img src={image} alt="Submitted animal" style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: "10px"}}/>
            <p><FaRegCalendarAlt/> {form?.date}</p>
            <p><FaMapMarkerAlt/> lon = {form?.x} ; lan = {form?.y}</p>
            <p><FaUser/> {form?.author?.username}</p>
            <p><FaEnvelope/> {form?.author?.email} </p>
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