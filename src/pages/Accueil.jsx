import { Link } from "react-router-dom";
import style from "../style/Accueil.module.css";

import Leaderboard from "../elements/Defis/Defis";
import Loading from "../elements/Components/Loading";

export default function Accueil() {
 return (
    <main className={style.accueil}>
       <div className={style.accueilmenu}>
            <div className={style.texteaccueil}>
                <p>Bienvenue sur Didactypo ! <br/>
                Ici tu peux apprendre à mieux utiliser ton clavier et te mesurer aux autres en t'amusant !
                </p>
            </div>
            <div className={style.leaderboard}>
               {loading ? <Loading /> : <Leaderboard idDefi={idSemaine} />}
            </div>
       </div>
       <div className={style.leaderboard}>
          <Leaderboard/>
       </div>
       <Link to="/somewhere">Go somewhere</Link>
    </main>
 )
}
