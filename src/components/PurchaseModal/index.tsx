import React from "react";
import Modal from "react-modal";
import "./styles.css";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const customStyles = {
  content: {
    backgroundColor: "#252525",
    width: "70%",
    height: "70%",
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

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <span className="modal-label">Sessões</span>
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottom: "1px solid #fff",
            }}
          >
            <div>Sala 1</div>
            <div>Horário 1</div>
            <div>Horário 2</div>
            <div>Horário 3</div>
          </div>
        );
      })}
      <span className="modal-description">Ingressos</span>
    </Modal>
  );
};

export default PurchaseModal;
