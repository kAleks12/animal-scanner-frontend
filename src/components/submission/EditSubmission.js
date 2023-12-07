import {useLocation, useNavigate} from "react-router-dom";
import * as React from "react";
import {useEffect, useState} from "react";
import {
  ContainerForNavbar,
  InnerContainer,
  InputReplacement,
  InputWrapper, NewSubmissionButtonWrapper,
  StyledInput, TagWrapper
} from "../styles";
import {HeadingXXLarge} from "baseui/typography";
import {useFormik} from "formik";
import {Button, KIND} from "baseui/button";
import {toast, ToastContainer} from "react-toastify";
import {Input} from "baseui/input";
import {Textarea} from "baseui/textarea";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {DatePicker} from "baseui/datepicker";
import Navbar from "../navbar/Navbar";
import "../navbar/Navbar.css"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";

const EditSubmission = () => {
  const {state} = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAbort = () => {
    navigate("/");
  }

  const addTag = (tag) => {
    formik.setFieldValue('tags', [...formik.values.tags, tag]);
  };

  const removeTag = (tag) => {
    formik.setFieldValue('tags', (formik.values.tags.filter(t => t !== tag)));
  };

  const handleKeyDown = (event) => {
    switch (event.keyCode) {
        // Enter
      case 13: {
        if (!value) return;
        if (value.length > 50) {
          toast.error("Tag is too long");
          return;
        }
        if (formik.values.tags.length > 10) {
          toast.error("Maximum number of tags reached");
          return;
        }
        if (formik.values.tags.includes(value)) {
          setValue("");
          return;
        }
        addTag(value);
        setValue('');
        return;
      }

      case 8: {
        if (value || !formik.values.tags.length) return;
        removeTag(formik.values.tags[formik.values.tags.length - 1]);
        return;
      }
    }
  };

  const onSubmit = async (values) => {
    try {
      let dateTimeObj = values.date[0];
      let date = dateTimeObj.getFullYear() + "-";
      if (dateTimeObj.getMonth() + 1 < 10) {
        date += "0";
      }
      date = date + (dateTimeObj.getMonth() + 1) + "-";
      if (dateTimeObj.getDate() < 10) {
        date += "0";
      }
      date += dateTimeObj.getDate();
      const body = {
        tags: values.tags,
        relevant_date: date,
        description: values.description
      }

      await axiosPrivate.put(
          "http://localhost:8080/api/v1/submission/" + state?.form?.id,
          body
      );
      toast.success("Submission created, redirecting in 2 seconds", {autoClose: false});
      await new Promise(r => setTimeout(r, 2000));
      navigate("/", {
        state: {
          position: state?.position
        }
      });
    } catch (err) {
      if (err?.code === "ERR_NETWORK") {
        toast.error("Connection to server failed");
      }
      if (err.response?.status === 500) {
        toast.error("Server error, try again later");
      } else if (err.response?.status === 422) {
        toast.error("Invalid submission data");
      } else {
        toast.error("Unknown error");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      tags: [],
      date: [new Date()],
      description: ''
    },
    onSubmit,
  });

  useEffect(() => {
    if (state === null) {
      navigate("/");
    }
    let array = [];
    state?.form?.tags.forEach(tag => {
      array.push(tag.value);
    });
    formik.setFieldValue('tags', array);
    let date = new Date(Date.parse(state?.form?.date));
    formik.setFieldValue('date', date);
    formik.setFieldValue('description', state?.form?.description);
  }, [state, navigate]);

  return (
      <>
        <Navbar/>
        <ContainerForNavbar>
          <InnerContainer>
            <div>
              <HeadingXXLarge>Correct the mistakes!</HeadingXXLarge>
              <TagWrapper>
                <Input
                    placeholder={formik.values.tags.length ? '' : 'Enter your tags'}
                    value={value}
                    onChange={e => setValue(e.currentTarget.value)}
                    overrides={{
                      Input: {
                        style: {width: 'auto', flexGrow: 1, overflowY: 'scroll', maxHeight: '300px'},
                        component: InputReplacement,
                        props: {
                          tags: formik.values.tags,
                          removeTag: removeTag,
                          onKeyDown: handleKeyDown,
                        },
                      },
                    }}
                />
              </TagWrapper>
              <InputWrapper>
                <DatePicker
                    value={formik.values.date}
                    onChange={({date}) => {
                      formik.setFieldValue('date', Array.isArray(date) ? date : [date]);
                    }}
                />
              </InputWrapper>
              <InputWrapper>
                <Textarea
                    value={formik.values.description}
                    onChange={e => formik.setFieldValue('description', e.target.value)}
                    placeholder="Enter description here"
                    clearOnEscape
                />
              </InputWrapper>
              <NewSubmissionButtonWrapper>
                <Button size="large" kind="secondary" onClick={() => setIsModalOpen(true)}>
                  Cancel
                </Button>
                <Button size="large" kind="primary" isLoading={formik.isSubmitting}
                        onClick={() => {formik.handleSubmit()}} type='submit'>
                  Save
                </Button>
              </NewSubmissionButtonWrapper>
            </div>
          </InnerContainer>
        </ContainerForNavbar>
        <Modal
            onClose={() => setIsModalOpen(false)}
            closeable
            isOpen={isModalOpen}
            animate
            size={SIZE.default}
            role={ROLE.dialog}
            overrides={{
              Dialog: {
                style: ({$theme}) => ({
                  border: `${$theme.colors.primary50} solid`
                })
              }
            }}
        >
          <ModalHeader>Submission cancel</ModalHeader>
          <ModalBody>
            You are about to return to the home page. Are you sure you want to discard any changes?
          </ModalBody>
          <ModalFooter>
            <ModalButton kind={KIND.tertiary} onClick={() => setIsModalOpen(false)}>
              No
            </ModalButton>
            <ModalButton onClick={handleAbort}>Yes</ModalButton>
          </ModalFooter>
        </Modal>
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
}
export {EditSubmission};