import React from "react";
import { Movie } from "../types/types";
import "./styles.css";
import Modal from "react-modal";

// import { Container } from './styles';

interface InvoiceModalProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

const customStyles = {
  content: {
    backgroundColor: "#252525",
    width: "40%",
    height: "40%",
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

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  if (!data) return null;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <div className="test">
        <span className="modal-label">Voucher de compra</span>
        <span>Id: {data.id} </span>
        <span>Valor: R$ {data.value_total}</span>
        <span>{data.createdAt}</span>
        <span onClick={onClose} className="cancel-button">
          Fechar
        </span>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
