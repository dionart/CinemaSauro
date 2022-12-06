import { useEffect, useState } from "react";
import "./App.css";
import api, { teste } from "./api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PurchaseModal from "./components/PurchaseModal";
import logo from "./assets/logo.png";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";
import { Invoice, Movie, Session, User } from "./components/types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailsModal from "./components/DetailsModal";
import InvoiceModal from "./components/InvoiceModal";

interface TheMovieDbProps {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface CreateMovieProps {
  title: string;
  censorship: string;
  category: string;
  duration: number;
  production_company: string;
  isPremiere: boolean;
  isNational: boolean;
  image_url: string;
}

interface Categories {
  [key: number]: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>();
  const [sessions, setSessions] = useState<Session[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie>();
  const [currentSession, setCurrentSession] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [current, setCurrent] = useState<Session>();
  const [user, setUser] = useState<User>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice>();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const fetchSessions = async () => {
    const response = await teste.get("/sessions");
    setSessions(response.data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleClick = (
    movie: Movie,
    sessionTitle: string,
    session: Session
  ) => {
    setIsOpen(true);
    setCurrentMovie(movie);
    setCurrentSession(sessionTitle);
    setCurrent(session);
  };

  return (
    <div className="App">
      <div className="header">
        <img className="logo" src={logo} />
        <span className="description">
          O melhor cinema da cidade de Souza, sempre com os melhores e mais
          recentes filmes em cartaz para você e sua família com descontos
          especiais para flamenguistas!
        </span>
        <div className="options">
          {!user && (
            <span onClick={() => setIsSignUpOpen(true)} className="login-text">
              Cadastre-se
            </span>
          )}

          <span onClick={() => setIsLoginOpen(true)} className="login-text">
            {user ? `Olá, ${user.name}` : "Login"}
          </span>
        </div>
      </div>
      <div className="now-playing-container">
        <span className="now-playing">Filmes em cartaz</span>
        <span className="label">
          Clique na imagem para ver detalhes sobre o filme
        </span>
      </div>
      <div className="movies">
        <Swiper
          style={{ zIndex: 0 }}
          spaceBetween={20}
          slidesPerView={4.5}
          pagination={{ clickable: true }}
        >
          {sessions?.length &&
            sessions.map((session, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    onClick={() => {
                      setCurrentMovie(session.movie);
                      setIsDetailsOpen(true);
                    }}
                    className="movie-image"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/original/${session.movie.imageUrl})`,
                    }}
                  >
                    <div className="age">
                      <span>{session.movie.censorship}</span>
                    </div>

                    <div className="movie-info">
                      <span className="movie-title">{session.movie.title}</span>
                      <span>Duração: {session.movie.duration}min</span>
                    </div>
                  </div>

                  <div key={index} className="session-date">
                    <span className="date">
                      {new Date(session.date_start).toLocaleDateString(
                        "pt-BR",
                        { day: "numeric", month: "numeric" }
                      )}
                      ,
                      {" " +
                        new Date(session.date_start).toLocaleDateString(
                          "pt-BR",
                          {
                            weekday: "short",
                          }
                        )}
                    </span>
                  </div>

                  <div className="session-times">
                    {session.timetable.split(",").map((item, index) => {
                      const time = item.replace(" ", "").slice(0, 5);

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            handleClick(session.movie, time, session)
                          }
                          className="session-container"
                        >
                          <span className="session-time">{time}</span>
                        </div>
                      );
                    })}
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      <PurchaseModal
        session={current!}
        sessionTime={currentSession}
        movieTitle={currentMovie?.title || ""}
        clientId={user?.id || "0"}
        onSuccess={(invoice) => {
          setIsOpen(false);
          toast.success("Sucesso!");
          setInvoice(invoice);
          setIsInvoiceOpen(true);
        }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <LoginModal
        onSuccess={(user) => {
          setIsLoginOpen(false);
          setUser(user);
          toast.success("Sucesso!");
        }}
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSuccess={() => {
          setIsSignUpOpen(false);
          toast.success("Sucesso!");
        }}
      />

      <DetailsModal
        movie={currentMovie!}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <InvoiceModal
        data={invoice}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
