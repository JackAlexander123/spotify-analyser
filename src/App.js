import React from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import './App.css';
import Header from "./Components/Header/Header";
import Home from "./Pages/Home/Home";
import Spotify from "./Pages/Spotify/Spotify";
import RedirectPage from "./Pages/RedirectPage";

function App() {
  return (
    <div className="App">
        <Header/>
        <main id={'main'}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/spotify" element={<Spotify/>} />
                    <Route path="/redirect" element={<RedirectPage/>} />
                </Routes>
            </BrowserRouter>
        </main>
    </div>
  );
}

export default App;
