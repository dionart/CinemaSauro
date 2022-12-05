import React, { useState } from "react";
import Modal from "react-modal";
import { inputMaps } from "./constants";
import "./styles.css";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  session: string;
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

interface Seat {
  seat: number;
  type: string;
  price: number;
}

Modal.setAppElement("#root");

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  movieTitle,
  session,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [lunches, setLunches] = useState<any[]>([]);

  const handleSelectSeat = (seat: number) => {
    const seatExists = selectedSeats.find((s) => s.seat === seat);
    if (seatExists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat !== seat));
    } else {
      setSelectedSeats([...selectedSeats, { seat, type: "", price: 0 }]);
    }
  };

  const handleChange = (eventValue: string, type: string, price: number) => {
    const seatsWithSameType = selectedSeats.filter((s) => s.type === type);

    if (seatsWithSameType.length > parseInt(eventValue)) {
      const seat = selectedSeats.find((s) => s.type === type);
      if (seat) {
        seat.type = "";
        seat.price = 0;
      }
      setSelectedSeats([...selectedSeats]);
    } else {
      const seat = selectedSeats.find((s) => s.type === "");
      if (seat) {
        seat.type = type;
        seat.price = price;
      }
      setSelectedSeats([...selectedSeats]);
    }
  };

  const handleLunchChange = (eventValue: string, type: string) => {
    const lunchExists = lunches.find((l) => l.type === type);

    if (lunchExists) {
      if (eventValue === "0") {
        setLunches(lunches.filter((l) => l.type !== type));
      } else {
        lunchExists.quantity = eventValue;
        setLunches([...lunches]);
      }
    } else {
      setLunches([...lunches, { quantity: eventValue, type, price: 10 }]);
    }
  };

  const renderItems = (array: any[]) => {
    const items = array.reduce((acc: any[], item: any) => {
      const itemExists = acc.find((i) => i.type === item.type);
      if (itemExists) {
        itemExists.quantity = parseInt(itemExists.quantity) + 1;
      } else {
        if (item.type !== "") {
          item.quantity = 1;
          acc.push(item);
        }
      }
      return acc;
    }, []);

    return items.map((item, index) => (
      <div className="cart-item">
        <span key={index} className="light-text">
          Ingresso - {item.type}
        </span>
        <span className="price">
          R$ {item.price} x{item.quantity}
        </span>
      </div>
    ));
  };

  const calculateTotal = () => {
    const total = selectedSeats.reduce((acc, seat) => {
      return acc + seat.price;
    }, 0);

    const totalLunches = lunches.reduce((acc, lunch) => {
      return acc + lunch.price * parseInt(lunch.quantity);
    }, 0);

    return total + totalLunches;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <span className="modal-label">
        {movieTitle} - {session}
      </span>
      <span className="light-text">Selecione seus acentos abaixo</span>
      <div className="seats-container">
        <div className="centered">
          <div className="screen">TELA</div>
          <div className="seats">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className={
                  selectedSeats.find((s) => s.seat === i)
                    ? "seat-selected"
                    : "seat"
                }
                onClick={() => handleSelectSeat(i)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="tickets-info">
          <span className="modal-label">
            Ingressos ({selectedSeats.length})
          </span>
          <span className="light-text">
            Selecione o tipo dos seus ingressos abaixo
          </span>

          {inputMaps.map((inputMap, index) => (
            <div className="input-row" key={index}>
              <span className="input-label">
                {inputMap.label}{" "}
                <span className="light-text">R$ {inputMap.price}</span>
              </span>
              <input
                className="number-input"
                type="number"
                max={selectedSeats.length}
                value={
                  selectedSeats.filter((s) => s.type === inputMap.type).length
                }
                onChange={(e) =>
                  handleChange(e.target.value, inputMap.type, inputMap.price)
                }
              />
            </div>
          ))}
        </div>
        <div className="lunch-info">
          <span className="modal-label">Lanches</span>
          <span className="light-text">
            O Cinema Sauro também conta com uma variedade de lanches para você
          </span>

          <div className="input-row">
            <span className="input-label">
              Nachos com cheddar <span className="light-text">R$ 10</span>
            </span>
            <input
              min={0}
              value={lunches.find((l) => l.type === "nachos")?.quantity || 0}
              className="number-input"
              type="number"
              onChange={(e) => handleLunchChange(e.target.value, "nachos")}
            />
          </div>
          <div className="input-row">
            <span className="input-label">
              Pipoca Salgada <span className="light-text">R$ 10</span>
            </span>
            <input
              value={
                lunches.find((l) => l.type === "pipoca salgada")?.quantity || 0
              }
              min={0}
              className="number-input"
              type="number"
              onChange={(e) =>
                handleLunchChange(e.target.value, "pipoca salgada")
              }
            />
          </div>
          <div className="input-row">
            <span className="input-label">
              Pipoca Doce <span className="light-text">R$ 10</span>
            </span>
            <input
              value={
                lunches.find((l) => l.type === "pipoca doce")?.quantity || 0
              }
              min={0}
              className="number-input"
              type="number"
              onChange={(e) => handleLunchChange(e.target.value, "pipoca doce")}
            />
          </div>
        </div>
        <div className="lunch-info">
          <span className="modal-label">Finalizar carrinho</span>
          <div className="checkout-items">
            {renderItems(selectedSeats)}
            {lunches.map((lunch, index) => (
              <div className="cart-item">
                <span key={index} className="light-text">
                  Lanche - {lunch.type}
                </span>
                <span className="price">
                  R$ {lunch.price} x{lunch.quantity}
                </span>
              </div>
            ))}
          </div>

          {selectedSeats.length > 0 && (
            <span className="total-price">R$ {calculateTotal()}</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
