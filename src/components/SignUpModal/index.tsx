import React, { useState } from "react";
import Modal from "react-modal";
import "./styles.css";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
import SuccessModal from "../SuccessModal";

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [CPF, setCPF] = useState("");
  const [feedback, setFeedback] = useState(false);

  const handleSignUp = async () => {
    try {
      const response = await api.post("/clients", {
        name: name,
        cpf: CPF,
        email: email,
        password: password,
      });

      response.data && setFeedback(true);
      response.data && onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  function cpfMask(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    e.currentTarget.maxLength = 14;
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return value;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <div className="modal-content-sign">
        <img className="logo" src={logo} />
        <span>Cadastre-se</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          type="text"
          className="login-input"
        />
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
        <input
          max={11}
          value={CPF}
          onChange={(e) => setCPF(cpfMask(e))}
          placeholder="CPF"
          type="text"
          className="login-input"
        />

        <button onClick={() => handleSignUp()} className="signup-button">
          Cadastrar
        </button>
        <span onClick={onClose} className="cancel-button">
          Cancelar
        </span>
      </div>
      <SuccessModal
        isOpen={feedback}
        onClose={() => {
          setFeedback(false);
          onClose();
        }}
      />
    </Modal>
  );
};

export default SignUpModal;
