// import {useState} from 'react'
import './App.css'
import {Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Arena from "./pages/Arena.tsx";
import Store from "./pages/Store.tsx";
import News from "./pages/News.tsx";
import About from './pages/About.tsx';

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="arena/:arenaId" element={<Arena/>} />
                    <Route path="store" element={<Store/>} />
                    <Route path="news" element={<News/>} />
                    <Route path="about" element={<About/>} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
