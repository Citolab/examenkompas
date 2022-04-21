import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import ExamenPage from './pages/vak-examen/examen';
import VakPage from './pages/vak-examen/vak';
import VakkenoverzichtPage from './pages/vakken-overzicht/vakken';

export function App() {
  return (
    <Routes>
      <Route
        path="/vak/:vakcode/:niveau/examen/:examenId/score"
        element={<ExamenPage />}
      />
      <Route
        path="/vak/:vakcode/:niveau/examen/:examenId"
        element={<ExamenPage />}
      />
      <Route path="/vak/:vakcode/:niveau" element={<VakPage />} />
      <Route path="/overzicht/:niveau" element={<VakkenoverzichtPage />} />
      <Route path="/overzicht" element={<VakkenoverzichtPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
