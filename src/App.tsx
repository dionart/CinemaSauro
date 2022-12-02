import { useEffect, useState } from "react";
import "./App.css";
import api from "./api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PurchaseModal from "./components/PurchaseModal";
import logo from "./assets/logo.png";

function App() {
  const [movies, setMovies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMovies = async () => {
    const response = await api.get(
      "/movie/now_playing?api_key=5b0fd1f184111afa2f58a58c7f9c695a"
    );
    setMovies(response.data.results);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="App">
      <div className="header">
        {/* <span className="title">Cinema Sauro</span> */}
        <img className="logo" src={logo} />
        <span className="description">
          O melhor cinema da cidade de Souza, sempre com os melhores e mais
          recentes filmes em cartaz para você e sua família.
        </span>
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
          {movies.map((movie) => {
            return (
              <SwiperSlide onClick={() => setIsOpen(true)}>
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
                    <span className="movie-title">{movie.original_title}</span>
                    <span>Nota: {movie.vote_average}</span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <PurchaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

export default App;
