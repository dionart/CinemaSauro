import React from "react";
import Modal from "react-modal";
import "./styles.css";

const customStyles = {
  content: {
    backgroundColor: "#10cf6c",
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

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <span className="text">Sucesso</span>

        <button onClick={onClose} className="button">
          Ok
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
