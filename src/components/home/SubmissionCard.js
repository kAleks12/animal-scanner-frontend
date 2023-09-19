import * as React from "react";
import {FaRegCalendarAlt, FaTags, FaMapMarkerAlt, FaUser} from 'react-icons/fa';
import "./SubmissionCard.css"

const SubmissionCard = ({image, form}) => {
    return (
        <div className='submission-container'>
            <img src={image} alt="Submitted animal" style={{width: '100%', height: '200px', objectFit: 'cover'}}/>
            <p><FaRegCalendarAlt/> {form?.date}</p>
            <p><FaMapMarkerAlt/> lon = {form?.x} ; lan = {form?.y}</p>
            <p><FaUser/> {form?.user} </p>
            <div>
                <FaTags/>
                {form?.tags.map((tag, index) => (
                    <span key={index} style={{
                        display: 'inline-block',
                        margin: '0.5rem',
                        padding: '5px',
                        background: '#1c1c1c',
                        borderRadius: '5px'
                    }}>{tag.value}</span>
                ))}
            </div>
            <h2>{form?.description}</h2>
        </div>
    );
};

export default SubmissionCard;