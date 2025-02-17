import style from "../style/Apprendre.module.css";
import { Link } from "react-router-dom";
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion.jsx';


export default function Apprendre() {
  
  return (
    <VerifConnection>
      <main className={style.apprendre}>
        <div className={style.texteapprendre}>
          <p>Bienvenue dans le mode apprentissage, <br/>
            ici vous pourrez vous améliorer sur votre clavier en suivant nos cours <br/>
            et en faisant des exercices pour vous entrainer.</p>
        </div>
        <div className={style.choixboutons}>
          <Link to="/apprendre/cours" className={style.boutonsCours}>Cours</Link>
          <Link to="/apprendre/exercices" className={style.boutonsCours}>Exercices</Link>
          <Link to="/apprendre/sandbox" className={style.boutonsCours}>Bac à sable</Link>
        </div>
      </main>
    </VerifConnection>
  );
}