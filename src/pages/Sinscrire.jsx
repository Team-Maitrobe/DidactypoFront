import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";

import Membres from "../elements/Membres";
import Defis from "../elements/Defis";

import style from "../style/Connexion.module.css";
import logo from "../img/logoDidactypo.png";

export default function Sinscrire() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [formData, setFormData] = useState({
    pseudo: "",
    mot_de_passe: "",
    nom: "",
    prenom: "",
    courriel: "",
    est_admin: false,
    moyMotsParMinute: 0,
    numCours: 0,
    tempsTotal: 0,
  });

  const fetchUtilisateurs = async () => {
    const reponse = await api.get("/utilisateurs/");
    setUtilisateurs(reponse.data);
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleInputChange = (evenement) => {
    const valeur = evenement.target.value;
    setFormData({
      ...formData,
      [evenement.target.name]: valeur,
    });
  };

  const handleFormSubmit = async (evenement) => {
    evenement.preventDefault();
    const pseudoExiste = utilisateurs.some(
      (utilisateur) => utilisateur.pseudo === formData.pseudo
    );
    if (pseudoExiste) {
      alert("Ce pseudo est déjà pris. Veuillez en choisir un autre.");
      return;
    }

    const courrielExiste = utilisateurs.some(
      (utilisateur) => utilisateur.courriel === formData.courriel
    );
    if (courrielExiste) {
      alert("Ce courriel est déjà utilisé. Veuillez en choisir un autre.");
      return;
    }

    await api.post("/utilisateurs/", formData);
    fetchUtilisateurs();
    setFormData({
      pseudo: "",
      mot_de_passe: "",
      nom: "",
      prenom: "",
      courriel: "",
      est_admin: false,
      moyMotsParMinute: 0,
      numCours: 0,
      tempsTotal: 0,
    });
  };

  return (
    <div className={style.connexion}>

      <form onSubmit={handleFormSubmit}>
        <img src={logo} alt="Logo" />
        <h1>S'inscrire</h1>

        <label htmlFor="pseudo">Pseudo</label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="mot_de_passe">Mot de passe</label>
        <input
          type="password"
          id="mot_de_passe"
          name="mot_de_passe"
          value={formData.mot_de_passe}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="prenom">Prénom</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="courriel">Courriel</label>
        <input
          type="email"
          id="courriel"
          name="courriel"
          value={formData.courriel}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Inscription</button>
        <p>
          Déjà inscrit ?
          <Link to="/seconnecter">Se connecter</Link>
        </p>
      </form>



      {/* ATTENTION A ENLEVER */}
      <Membres />
      <Defis />

    </div>
  );
}
