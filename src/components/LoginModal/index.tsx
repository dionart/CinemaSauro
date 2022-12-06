import React, { useState } from "react";
import Modal from "react-modal";
import "./styles.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
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
import { api } from "../../api";

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/clients/login", {
        email: email,
        password: password,
      });

      response.data && onSuccess(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <div className="modal-content-login">
        <img className="logo" src={logo} />
        <span>Login</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="login-input"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="login-input"
        />
        <button onClick={() => handleLogin()} className="login-button">
          Entrar
        </button>
        <span onClick={onClose} className="cancel-button">
          Cancelar
        </span>
      </div>
    </Modal>
  );
};

export default LoginModal;
