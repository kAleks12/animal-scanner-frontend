import {useLocation, useNavigate} from "react-router-dom";
import * as React from "react";
import {useEffect, useState} from "react";
import {
    ContainerForNavbar,
    FormButtonWrapper,
    InnerContainer,
    InputReplacement,
    InputWrapper,
    StyledInput
} from "../commons";
import {HeadingXXLarge} from "baseui/typography";
import {useFormik} from "formik";
import {Button, KIND} from "baseui/button";
import {toast, ToastContainer} from "react-toastify";
import {Input} from "baseui/input";
import {Textarea} from "baseui/textarea";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {aiAxios} from "../../api/axios";
import {DatePicker} from "baseui/datepicker";
import Navbar from "../navbar/Navbar";
import "../navbar/Navbar.css"
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";

const NewSubmission = () => {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [file, setFile] = useState(undefined);
    const [defaultTagsLoaded, setDefaultTagsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAbort = () => {
        navigate("/");
    }

    useEffect(() => {
        if (state === null) {
            navigate("/");
        }
    }, [state, navigate]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

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
            if (file === undefined) {
                toast.error("Please upload a file");
                return;
            }

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
                x: state?.position[0],
                y: state?.position[1],
                tags: values.tags,
                relevant_date: date,
                description: values.description
            }

            const response = await axiosPrivate.post(
                "http://localhost:8080/api/v1/submission",
                body
            );

            const formData = new FormData();
            formData.append("file", file);
            await axiosPrivate.post(
                `http://localhost:8080/api/v1/submission/photo`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    params: {
                        sub_id: response.data.id
                    }
                }
            );
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
            return;
        }
        toast.success("Submission created, redirecting in 2 seconds", {autoClose: false});
        await new Promise(r => setTimeout(r, 2000));
        navigate("/", {
            state: {
                position: state?.position
            }
        });
    };

    const formik = useFormik({
        initialValues: {
            tags: [],
            date: [new Date()],
            description: "",
        },
        onSubmit,
    });

    const handleGetDefaultTags = async () => {
        if (file === undefined) {
            toast.error("Please upload a file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);


        const response = await toast.promise(
            aiAxios.post("/classifier/classify", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }),
            {
                pending: 'Loading default tags',
                success: 'Default tags loaded',
                error: 'Failed to load default tags'
            }
        );
        await formik.setFieldValue('tags', [...formik.values.tags, ...response.data.data.tags]);
        setDefaultTagsLoaded(true);
    };

    useEffect(() => {
        if (formik.values.tags.length === 0) {
            setDefaultTagsLoaded(false);
        }
    }, [formik.values.tags]);

    useEffect(() => {
        setDefaultTagsLoaded(false);
        formik.setFieldValue('tags', []);
    }, [file]);

    return (
        <>
            <Navbar/>
            <ContainerForNavbar>
                <InnerContainer>
                    <div>
                        <HeadingXXLarge>Tell us the whole story!</HeadingXXLarge>
                        <InputWrapper>
                            <StyledInput
                                onChange={handleFileChange}
                                name="file"
                                type="file"
                                placeholder="Upload file"
                            />
                        </InputWrapper>
                        <FormButtonWrapper>
                            <Input
                                placeholder={formik.values.tags.length ? '' : 'Enter your tags'}
                                value={value}
                                onChange={e => setValue(e.currentTarget.value)}
                                overrides={{
                                    Input: {
                                        style: {width: 'auto', flexGrow: 1},
                                        component: InputReplacement,
                                        props: {
                                            tags: formik.values.tags,
                                            removeTag: removeTag,
                                            onKeyDown: handleKeyDown,
                                        },
                                    },
                                }}
                            />
                            <Button size="large" kind="primary" disabled={defaultTagsLoaded}
                                    onClick={handleGetDefaultTags}>
                                Scan
                            </Button>
                        </FormButtonWrapper>
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
                        <FormButtonWrapper>
                            <Button size="large" kind="primary" isLoading={formik.isSubmitting}
                                    onClick={() => formik.handleSubmit} type='submit'>
                                Submit
                            </Button>
                            <Button size="large" kind="secondary" onClick={() => setIsModalOpen(true)}>
                                Cancel
                            </Button>
                        </FormButtonWrapper>
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
                    You are about to return to the home page. Are you sure you want to discard the submission?
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
export {NewSubmission};