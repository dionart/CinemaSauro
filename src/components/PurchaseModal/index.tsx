import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { api } from "../../api";
import { Session, Snack } from "../types/types";
import { inputMaps } from "./constants";
import "./styles.css";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  sessionTime: string;
  session: Session;
  onSuccess: (invoice: any) => void;
  clientId: string;
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
  category: string;
  value: number;
  session_id: string;
  date_session: string;
  quantity?: number;
}

const categoryToName: {
  [key: string]: string;
} = {
  adult: "Adulto",
  senior: "Idoso",
  child: "Criança",
  student: "Estudante",
  flamenguista: "Flamenguista",
};

//create a map with the key as the day of the week name in portuguese and the value as the discount

const dayToDiscount: {
  [key: string]: number;
} = {
  "segunda-feira": 0.1,
  "terça-feira": 0.1,
  "quarta-feira": 0.1,
  "quinta-feira": 0.1,
  "sexta-feira": 0.1,
  sábado: 0.1,
  domingo: 0.1,
};

Modal.setAppElement("#root");

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  movieTitle,
  sessionTime,
  session,
  onSuccess,
  clientId,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [lunches, setLunches] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (session) fetchSeats();
    fetchSnacks();
    if (session) fetchTypeSessions();
  }, [session, isOpen]);

  const fetchSeats = async () => {
    const response = await api.get(`/tickets/seats/${session.id}`);

    setSeats(response.data);
  };

  const fetchSnacks = async () => {
    const response = await api.get("/snacks");

    setSnacks(response.data);
  };

  const handleClose = () => {
    setSelectedSeats([]);
    setLunches([]);
    setSeats([]);
    setSnacks([]);
    onClose();
  };

  const handleSelectSeat = (seat: number) => {
    const seatExists = selectedSeats.find((s) => s.seat === seat);
    if (seatExists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat !== seat));
    } else {
      setSelectedSeats([
        ...selectedSeats,
        {
          seat,
          category: "",
          value: 0,
          session_id: session.id,
          date_session: session.date_start,
        },
      ]);
    }
  };

  const handleChange = (eventValue: string, type: string, price: number) => {
    const seatsWithSameType = selectedSeats.filter((s) => s.category === type);

    if (seatsWithSameType.length > parseInt(eventValue)) {
      const seat = selectedSeats.find((s) => s.category === type);
      if (seat) {
        seat.category = "";
        seat.value = 0;
      }
      setSelectedSeats([...selectedSeats]);
    } else {
      const seat = selectedSeats.find((s) => s.category === "");
      if (seat) {
        seat.category = type;
        seat.value = price;
      }
      setSelectedSeats([...selectedSeats]);
    }
  };

  const handleLunchChange = (eventValue: string, snack: any) => {
    const lunchExists = lunches.find((l) => l.snack_id === snack.id);
    if (lunchExists) {
      if (eventValue === "0") {
        setLunches(lunches.filter((l) => l.snack_id !== snack.id));
      } else {
        lunchExists.quantity = eventValue;
        setLunches([...lunches]);
      }
    } else {
      setLunches([
        ...lunches,
        {
          quantity: eventValue,
          name: snack.name,
          value: snack.value,
          snack_id: snack.id,
        },
      ]);
    }
  };

  const renderItems = (array: any[]) => {
    const items = array.reduce((acc: any[], item: any) => {
      const itemExists = acc.find((i) => i.category === item.category);
      if (itemExists) {
        itemExists.quantity = parseInt(itemExists.quantity) + 1;
      } else {
        if (item.category !== "") {
          item.quantity = 1;
          acc.push(item);
        }
      }
      return acc;
    }, []);

    return items.map((item, index) => (
      <div key={index} className="cart-item">
        <span key={index} className="light-text">
          Ingresso - {categoryToName[item.category]}
        </span>
        <span className="price">
          R$ {item.value} x{item.quantity}
        </span>
      </div>
    ));
  };

  const fetchTypeSessions = async () => {
    const response = await api.get("/type-sessions/");

    const weekDay = new Date(session.date_start).toLocaleDateString("pt-BR", {
      weekday: "long",
    });

    const discount = response.data.find(
      (type: any) => type.name === weekDay
    ).discount_percentage;

    setDiscount(discount);
  };

  const handleSubmit = async (isCard: boolean) => {
    if (clientId === "0")
      return alert("É necessário estar logado para comprar ingressos");

    if (!selectedSeats.length) return alert("Selecione pelo menos um ingresso");

    if (selectedSeats.find((s) => s.category === ""))
      return alert("Selecione o tipo dos ingressos");

    const client_id = clientId;

    lunches.map((lunch) => {
      delete lunch.name;
      if (typeof lunch.value === "string") {
        lunch.value = parseInt(lunch.value.replace("$", ""));
      }
    });

    selectedSeats.map((ticket) => {
      delete ticket.quantity;
    });

    const response_body = {
      client_id,
      tickets: selectedSeats,
      snacks: lunches,
      value_total: isCard
        ? calculateTotal() + 0.1 * calculateTotal()
        : calculateTotal(),
    };

    try {
      const response = await api.post("/purchases", response_body);

      handleClose();
      onSuccess(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = () => {
    const total = selectedSeats.reduce((acc, seat) => {
      return acc + seat.value;
    }, 0);

    const totalLunches = lunches.reduce((acc, lunch) => {
      if (typeof lunch.value === "string") {
        return (
          acc +
          parseInt(lunch.value.replace("$", "")) * parseInt(lunch.quantity)
        );
      }

      return acc + lunch.value * parseInt(lunch.quantity);
    }, 0);

    return total + totalLunches - (total + totalLunches) * (discount / 100);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <span className="modal-label">
        {movieTitle} - {sessionTime}
      </span>
      <span className="light-text">Selecione seus assentos abaixo</span>
      <div className="seats-container">
        <div className="centered">
          <div className="screen">TELA</div>
          <div className="seats">
            {seats.length &&
              seats.map((seat, i) => (
                <div
                  key={i}
                  className={
                    selectedSeats.find((s) => s.seat === i + 1) ||
                    !seat.available
                      ? "seat-selected"
                      : "seat"
                  }
                  onClick={() =>
                    seat.available ? handleSelectSeat(seat.seat) : null
                  }
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
                  selectedSeats.filter((s) => s.category === inputMap.type)
                    .length
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

          {snacks.length &&
            snacks.map((snack, index) => (
              <div key={index} className="input-row">
                <span className="input-label">
                  {snack.name} <span className="light-text">{snack.value}</span>
                </span>
                <input
                  min={0}
                  value={
                    lunches.find((l) => l.snack_id === snack.id)?.quantity || 0
                  }
                  className="number-input"
                  type="number"
                  onChange={(e) => handleLunchChange(e.target.value, snack)}
                />
              </div>
            ))}
        </div>
        <div className="lunch-info">
          <span className="modal-label">Finalizar carrinho</span>
          <div className="checkout-items">
            {renderItems(selectedSeats)}
            {lunches.map((lunch, index) => (
              <div className="cart-item">
                <span key={index} className="light-text">
                  Lanche - {lunch.name}
                </span>
                <span className="price">
                  R{lunch.value} x{lunch.quantity}
                </span>
              </div>
            ))}
          </div>

          {selectedSeats.length > 0 && (
            <>
              <span className="total-price">R$ {calculateTotal()}</span>

              <span className="label-warning">Desconto: {discount}%</span>
              <span className="label-warning">
                Ao comprar com cartão haverá um acréscimo de R$
                {0.1 * calculateTotal()}
              </span>
            </>
          )}
        </div>
      </div>
      <button
        className="submit-purchase-button"
        onClick={() => handleSubmit(false)}
      >
        Comprar
      </button>
      <button
        className="submit-purchase-button-card"
        onClick={() => handleSubmit(true)}
      >
        Comprar com cartão
      </button>
    </Modal>
  );
};

export default PurchaseModal;
