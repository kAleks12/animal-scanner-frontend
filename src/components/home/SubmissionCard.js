import * as React from "react";
import {FaEnvelope, FaMapMarkerAlt, FaRegCalendarAlt, FaTags, FaUser} from 'react-icons/fa';
import "./SubmissionCard.css"
import useAuth from "../../hooks/useAuth";
import {Button} from "baseui/button";
import {SubmissionButtonWrapper} from "../styles";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";

const SubmissionCard = ({image, form}) => {
  if (form?.tags.length === 0) {
    form?.tags.push({value: "No tags provided"});
  }
  const axiosPrivate = useAxiosPrivate()
  const description = form?.description || "No description provided";
  const username = form?.author?.username || "Account deleted";
  const email = form?.author?.email || "Account deleted";
  const {auth} = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/submission/${form.id}`);
      toast.success("Submission deleted", {autoClose: false});
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
  const handleEdit = () => {
    navigate("/edit-submission", {
      state: {
        form: form
      }
    });
  }

  let actions;
  if (auth?.user === form?.author?.username) {
    actions = <SubmissionButtonWrapper>
      <Button kind="secondary" style={{width: '5rem'}} onClick={handleEdit}>
        Edit
      </Button>
      <Button kind="secondary" style={{width: '5rem'}} onClick={() => handleDelete()}>
        Delete
      </Button>
    </SubmissionButtonWrapper>;
  } else {
    actions = <></>;
  }

  return (
      <>
        <div className='submission-container'>
          <img src={image} alt="Submitted animal"
               style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: "10px"}}/>
          <div style={{display: "flex", alignItems: "center", columnGap: "0.5rem"}}><FaRegCalendarAlt/> {form?.date}
          </div>
          <div style={{display: "flex", alignItems: "center", columnGap: "0.5rem"}}>
            <FaMapMarkerAlt/> {form?.x}, {form?.y}</div>
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
          {actions}
        </div>
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
  );
};

export default SubmissionCard;