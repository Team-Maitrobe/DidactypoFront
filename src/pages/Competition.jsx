import { useState, useEffect } from 'react';
import { api, getPseudo } from "../api";
import style from '../style/Competition.module.css';
import VerifConnection from '../elements/CompteUtilisateur/VerifConnexion.jsx';
import InterfaceSaisie from '../elements/InterfaceSaisie/InterfaceSaisie.jsx';
import Leaderboard from "../elements/Defis/Defis.jsx";
import Loading from '../elements/Components/Loading.jsx';

export default function Competition() {
    const [idSemaine, setIdSemaine] = useState(null);
    const [userPseudo] = useState(getPseudo());
    const [defis, setDefis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [lastScore, setLastScore] = useState(null);
    const [currentDefi, setCurrentDefi] = useState(null);

    const defiSemaine = async () => {
        try {
            const response = await api.get("/defi_semaine");
            setIdSemaine(response.data.numero_defi);
        } catch (fetchError) {
            console.error("Error fetching weekly challenge ID:", fetchError);
            setError("Erreur lors de la récupération de l'ID du défi de la semaine.");
        }
    }

    // Fetch initial des défis
    useEffect(() => {
        defiSemaine();
        const fetchDefis = async () => {
            try {
                const defisResponse = await api.get("/defis");
                setDefis(defisResponse.data);
            } catch (err) {
                console.error("Error fetching challenges:", err);
                setError('Erreur lors de la récupération des défis.');
            }
        };
        fetchDefis();
    }, []);


    // Fetch des défis et du dernier score
    useEffect(() => {
        const fetchLastScore = async () => {
            if (userPseudo) {
                try {
                    const reussitesResponse = await api.get(`/reussites_defi/utilisateurs/${userPseudo}`);
                    if (reussitesResponse.data && reussitesResponse.data.length > 0) {
                        const sortedReussites = reussitesResponse.data.sort(
                            (a, b) => new Date(b.date_reussite) - new Date(a.date_reussite)
                        );
                        setLastScore(sortedReussites[0].temps_reussite);
                    }
                } catch (reussitesError) {
                    console.error("Error fetching last score:", reussitesError);
                }
            }
        };

        fetchLastScore();
    }, [userPseudo]);


    // Mise à jour du défi courant quand idSemaine ou defis change
    useEffect(() => {
        if (defis.length > 0 && idSemaine !== null) {
            const defi = defis.find(d => d.id_defi === idSemaine);

            if (defi) {
                setCurrentDefi(defi);
                setError(null);
            }
            setIsLoading(false);
        }
    }, [idSemaine, defis]);


    // Logique pour démarrer la saisie
    const handleReadyClick = () => {
        setIsReady(true);
        setStartTime(new Date());
        setEndTime(null);
    };

    const gestionDefiQuotidien = async (userPseudo) => {
        const dateAct = new Date();
        try {
            const userResponse = await api.get(`/utilisateur/${userPseudo}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            let cptDefi = userResponse.data.cptDefi;
            const reponse = await api.get(`/reussites_defi/${userPseudo}`);
            const reussites = reponse.data;

            const sortedReussites = reussites.sort(
                (a, b) => new Date(b.date_reussite) - new Date(a.date_reussite)
            );

            const lastDateReussite = sortedReussites.length > 0 ? sortedReussites[0].date_reussite : null;

            if (lastDateReussite) {
                const dateDerniereReussite = new Date(lastDateReussite);

                const isSameDay = dateAct.getDate() === dateDerniereReussite.getDate() &&
                    dateAct.getMonth() === dateDerniereReussite.getMonth() &&
                    dateAct.getFullYear() === dateDerniereReussite.getFullYear();

                if (!isSameDay) {
                    cptDefi++;
                }
            } else {
                cptDefi = 1;
            }

            await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });

            try {
                if (cptDefi === 3) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=4`);
                if (cptDefi === 7) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=5`);
                if (cptDefi === 14) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=6`);
                if (cptDefi === 20) await api.post(`/gain_badge/?pseudo_utilisateur=${userPseudo}&id_badge=7`);
            } catch (badgeError) {
                console.error("Error updating badge:", badgeError);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const cptDefi = 1;
                try {
                    await api.put(`/utilisateurs/${userPseudo}/cptDefi`, { cptDefi });
                    return cptDefi;
                } catch (putError) {
                    console.error("Error setting initial daily challenge count:", putError);
                    throw putError;
                }
            }
            console.error("Error in daily challenge management:", error);
            throw error;
        }
    };

    // Calcul du temps écoulé une fois terminé
    useEffect(() => {
        if (startTime && endTime) {
            const timeDiff = (endTime - startTime) / 1000;
            setIsReady(false);
            setLastScore(timeDiff);

            const updateDatabase = async () => {
                if (!currentDefi) {
                    console.error("Cannot update database: currentDefi is not set.");
                    setError("Erreur interne : Défi actuel non défini.");
                    return;
                }
                try {
                    const payload = {
                        id_defi: currentDefi.id_defi,
                        pseudo_utilisateur: userPseudo,
                        temps_reussite: timeDiff,
                    };
                    const typeStat = "tempsdefi";

                    const token = localStorage.getItem('token');
                    if (token) {
                        await api.post(`/reussites_defi/?id_defi=${payload.id_defi}&temps_reussite=${payload.temps_reussite}`, null, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } else {
                        console.error("No token found in localStorage for submitting score");
                        setError("Non connecté pour la soumission du score.");
                        return;
                    }
                    await api.post(`/stat/?pseudo_utilisateur=${userPseudo}&type_stat=${typeStat}&valeur_stat=${payload.temps_reussite}`);

                    await gestionDefiQuotidien(userPseudo);

                    window.location.reload();

                } catch (dbError) {
                    console.error("Error updating database or stats:", dbError);
                    setError('Erreur lors de la sauvegarde du score.');
                }
            };

            updateDatabase();
        }
    }, [endTime]);

    return (
        <VerifConnection>
            <main className={style.Competition}>
                {isLoading ? (
                    <Loading />
                ) : error ? (
                    <p className={style.error}>{error}</p>
                ) : (
                    <div className={style.competContainer}>
                        <div className={style.defi}>
                            {!isReady && (
                                <div className={style.readyButtonContainer}>
                                    <h3>
                                        Bienvenue dans le mode compétition !
                                        Ici, tu vas pouvoir te mesurer aux autres joueurs en réalisant des défis de vitesse de frappe.
                                        Lorsque tu te sens prêt, appuie sur le bouton ci-dessous.
                                    </h3>
                                    <button
                                        onClick={handleReadyClick}
                                        className={style.readyButton}
                                        disabled={!currentDefi}
                                    >
                                        Commencer le défi
                                    </button>
                                    <h3>
                                        Si jamais tu as du mal, n\'hésite pas à aller consulter l\'onglet \"Apprendre\" ! Bonne chance !
                                    </h3>
                                </div>
                            )}
                            {isReady && currentDefi && (
                                <InterfaceSaisie
                                    targetText={currentDefi.description_defi}
                                    setEndTime={setEndTime}
                                    isReady={isReady}
                                />
                            )}
                            {lastScore && !isReady && (
                                <div className={style.lastScoreContainer}>
                                    <h4>Ton dernier temps : {lastScore} secondes</h4>
                                </div>
                            )}
                        </div>
                        <div className={style.leaderboard}>
                            <Leaderboard idDefi={idSemaine} />
                        </div>
                    </div>
                )}
            </main>
        </VerifConnection>
    );
}