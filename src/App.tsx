import { useEffect, useState } from "react";
import "./App.css";
import api from "./api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PurchaseModal from "./components/PurchaseModal";
import logo from "./assets/logo.png";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";

interface Movie {
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

function App() {
  const [movies, setMovies] = useState<Movie[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie>();
  const [currentSession, setCurrentSession] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const fetchMovies = async () => {
    const response = await api.get(
      "/movie/now_playing?api_key=5b0fd1f184111afa2f58a58c7f9c695a"
    );
    setMovies(response.data.results);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleClick = (movie: Movie, session: string) => {
    setIsOpen(true);
    setCurrentMovie(movie);
    setCurrentSession(session);
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
          <span onClick={() => setIsSignUpOpen(true)} className="login-text">
            Cadastre-se
          </span>
          <span onClick={() => setIsLoginOpen(true)} className="login-text">
            Login
          </span>
        </div>
      </div>
      <span className="now-playing">Filmes em cartaz</span>

      <div className="movies">
        <Swiper
          style={{ zIndex: 0 }}
          spaceBetween={20}
          slidesPerView={4.5}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          pagination={{ clickable: true }}
        >
          {movies?.length &&
            movies.map((movie, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className="movie-image"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`,
                    }}
                  >
                    {movie.adult && (
                      <div className="age">
                        <span>18</span>
                      </div>
                    )}

                    <div className="movie-info">
                      <span className="movie-title">
                        {movie.original_title}
                      </span>
                      <span>Nota: {movie.vote_average}</span>
                    </div>
                  </div>

                  {[1, 2].map((item, index) => {
                    return (
                      <div key={index} className="session-date">
                        <span className="date">04/12 - Quarta-feira</span>
                        <div className="session-times">
                          <div
                            onClick={() => handleClick(movie, "14:00")}
                            className="session-container"
                          >
                            <span className="session-time">14:00</span>
                          </div>
                          <div
                            onClick={() => handleClick(movie, "16:00")}
                            className="session-container"
                          >
                            <span className="session-time">16:00</span>
                          </div>
                          <div
                            onClick={() => handleClick(movie, "21:30")}
                            className="session-container"
                          >
                            <span className="session-time">21:30</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>

      <PurchaseModal
        session={currentSession}
        movieTitle={currentMovie?.title || ""}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </div>
  );
}

export default App;
