import React from "react";
import Modal from "react-modal";
import "./styles.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const customStyles = {
  content: {
    backgroundColor: "#252525",
    width: "20%",
    padding: "30px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    border: 0,
  },
};

import logo from "../../assets/logo.png";

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <img className="logo" src={logo} />
        <span>Login</span>
        <input placeholder="Email" type="email" className="login-input" />
        <input placeholder="Password" type="password" className="login-input" />
        <button className="button">Entrar</button>
        <span onClick={onClose} className="cancel-button">
          Cancelar
        </span>
      </div>
    </Modal>
  );
};

export default LoginModal;
