import React from 'react';
// https://fkhadra.github.io/react-toastify/introduction
import { ToastContainer as Container, toast } from 'react-toastify';

const toastOption = {
  position: "top-center",
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light"
} as object

export const Toast = {
  success: toast.success,
  info: toast.info,
  warn: toast.warn,
  error: toast.error
}

const ToastContainer = () => {

  return <Container {...toastOption} />
}

export default ToastContainer;