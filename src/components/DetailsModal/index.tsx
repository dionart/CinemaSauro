import React, { useEffect, useState } from "react";
import { Movie } from "../types/types";
import "./styles.css";
import Modal from "react-modal";
import { api } from "../../api";

interface DetailsModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

const customStyles = {
  content: {
    backgroundColor: "#252525",
    width: "40%",
    height: "fit-content",
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

const DetailsModal: React.FC<DetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  const [cast, setCast] = useState<any>([]);

  const fetchCast = async () => {
    const response = await api.get(`/movies/${movie.id}/cast`);

    setCast(response.data[0].actors);
  };

  useEffect(() => {
    if (movie) fetchCast();
  }, [movie, isOpen]);

  if (!movie) return null;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as Modal.Styles}
      contentLabel="Example Modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <div className="left-container">
          <img className="movie-poster" src={movie.imageUrl} />
        </div>
        <div className="right-container">
          <span className="modal-label">{movie && movie.title}</span>

          <span>Sinopse: {movie.description}</span>
          <span>Gênero: {movie && movie.category}</span>
          <span>Censura: {movie.censorship}</span>
          <span>Duração: {movie.duration} min</span>
          <span>Nacional: {movie.isNational ? "Sim" : "Não"}</span>
          <span>Premier: {movie.isPremiere ? "Sim" : "Não"}</span>
          <span>Distribuição: {movie.production_company}</span>
          {cast.length > 0 && <span>Elenco:</span>}
          <div className="cast-container">
            {cast.map((actor: any, index: number) => (
              <span key={index}>{actor.name}, </span>
            ))}
          </div>
        </div>
      </div>
      <span onClick={onClose} className="cancel-button">
        Fechar
      </span>
    </Modal>
  );
};

export default DetailsModal;
