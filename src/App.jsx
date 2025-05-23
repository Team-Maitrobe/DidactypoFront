import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './style/App.css';
import Header from './elements/Header/Header';
import Footer from './elements/Footer/Footer';
import Loading from './elements/Components/Loading';

const Accueil = lazy(() => import('./pages/Accueil'));
const Apprendre = lazy(() => import('./pages/Apprendre'));
const Competition = lazy(() => import('./pages/Competition'));
const ChoixClasse = lazy(() => import('./pages/ChoixClasse'));
const MaClasse = lazy(() => import('./pages/MaClasse'));
const InfosUtiles = lazy(() => import('./pages/InfosUtiles'));
const Compte = lazy(() => import('./pages/Compte'));
const Sinscrire = lazy(() => import('./pages/Sinscrire'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ListeCours = lazy(() => import('./pages/ListeCours'));
const ListeExercices = lazy(() => import('./pages/ListeExercices'));
const Sandbox = lazy(() => import('./pages/Sandbox'));
const BadgeInfo = lazy(() => import('./pages/BadgeInfo'));

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/apprendre" element={<Apprendre />} />
            <Route path="/competition" element={<Competition />} />
            <Route path="/classe" element={<ChoixClasse />} />
            <Route path="/classe/:id" element={<MaClasse />} />
            <Route path="/infos" element={<InfosUtiles />} />
            <Route path="/profil/:pseudo" element={<Compte />} />
            <Route path="/profil" element={<Navigate to="/" />} />
            <Route path="/inscription" element={<Sinscrire />} />
            <Route path="/apprendre/cours" element={<ListeCours />} />
            <Route path="/apprendre/exercices" element={<ListeExercices />} />
            <Route path="/apprendre/sandbox" element={<Sandbox />} />
            <Route path="/badge/:badgeId" element={<BadgeInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
