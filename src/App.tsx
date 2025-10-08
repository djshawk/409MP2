import { Routes, Route, NavLink } from "react-router-dom";
import ListView from "./views/ListView";
import GalleryView from "./views/GalleryView";
import DetailView from "./views/DetailView";
import styles from "./styles/App.module.css";
import { SelectionProvider } from "./context/SelectionContext";

export default function App() {
  return (
    <SelectionProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1>Characters From Marvel</h1>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? styles.active : undefined
              }
            >
              List
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? styles.active : undefined
              }
            >
              Gallery
            </NavLink>
          </nav>
        </header>

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/character/:id" element={<DetailView />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          <small>
            Data:{" "}
            <a href="https://developer.marvel.com/" target="_blank" rel="noreferrer">
              Marvel API
            </a>
          </small>
        </footer>
      </div>
    </SelectionProvider>
  );
}
