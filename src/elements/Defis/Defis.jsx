import { useState, useEffect } from "react";

import { api, getPseudo } from "../../api";

import style from "./Defis.module.css";


export default function Defis({idDefi}) {
    const [userPseudo, setUserPseudo] = useState(getPseudo()); // Pseudo de l'utilisateur actuel
    const [reussitesDefis, setReussitesDefis] = useState([]);
    const [classementUtilisateur, setClassementUtilisateur] = useState(null); // Classement de l'utilisateur actuel

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fonction pour récupérer les réussites de défi
    const fetchReussitesDefi = async () => {

        try {
            const reponse = await api.get(`/reussites_defi/defi/${idDefi}`);
            const data = reponse.data.sort((a, b) => a.temps_reussite - b.temps_reussite);
            setReussitesDefis(data);
            if (userPseudo) {
                // Trouver le classement de l'utilisateur actuel
                const indexUtilisateur = data.findIndex(
                    (item) => item.pseudo_utilisateur === userPseudo
                );
                if (indexUtilisateur !== -1) {
                    setClassementUtilisateur({
                        position: indexUtilisateur + 1,
                        ...data[indexUtilisateur],
                    });
                }
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchReussitesDefi();
    }, []);


    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Affiche la date et l'heure sous un format local
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = reussitesDefis.slice(startIndex, endIndex);

    // Ajouter des lignes vides si nécessaire pour atteindre 10 lignes
    const rows = [...currentItems];
    while (rows.length < itemsPerPage) {
        rows.push({
            pseudo_utilisateur: "---",
            temps_reussite: "---",
            date_reussite: "---",
        });
    }

    const utilisateurDansTop10 = currentItems.some(
        (item) => item.pseudo_utilisateur === userPseudo
    );

    if (!utilisateurDansTop10 && classementUtilisateur) {
        rows.push({
            pseudo_utilisateur: classementUtilisateur.pseudo_utilisateur,
            temps_reussite: classementUtilisateur.temps_reussite,
            date_reussite: classementUtilisateur.date_reussite,
            position: classementUtilisateur.position, // Ajouter une position explicite
        });
    }

    // Gérer les boutons de pagination
    const totalPages = Math.ceil(reussitesDefis.length / itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    return (
        <div className={style.tableWrapper}>
            <table className={style.table}>
                <thead className={style.headtable}>
                    <tr>
                        <th className={style.headcell}>Position</th>
                        <th className={style.headcell}>Pseudo</th>
                        <th className={style.headcell}>Temps</th>
                        <th className={style.headcell}>Date</th>
                    </tr>
                </thead>
                <tbody className={style.corpstable}>
                    {rows.map((reussiteDefi, index) => {
                        const position = reussiteDefi.position || startIndex + index + 1;
                        const isCurrentUser = reussiteDefi.pseudo_utilisateur === userPseudo;

                        return (
                            <tr
                                className={`${style.lignejoueur} ${isCurrentUser ? style.utilisateurActuel : ""
                                    }`}
                                key={index}
                                onClick={() => {
                                    // Navigate to the user's profile when the row is clicked
                                    window.location.href = `/profil/${reussiteDefi.pseudo_utilisateur}`;
                                }}
                                style={{ cursor: "pointer" }} // Change cursor to indicate clickability
                            >
                                <td className={style.cellule}>{position}</td>
                                <td className={style.cellule}>{reussiteDefi.pseudo_utilisateur}</td>
                                <td className={style.cellule}>
                                    {reussiteDefi.temps_reussite !== "---"
                                        ? `${reussiteDefi.temps_reussite} s`
                                        : "---"}
                                </td>
                                <td className={style.cellule}>
                                    {reussiteDefi.date_reussite !== "---"
                                        ? formatDate(reussiteDefi.date_reussite)
                                        : "---"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className={style.pagination}>
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={style.pageButton}
                >
                    Précédent
                </button>
                <span className={style.pageInfo}>
                    Page {currentPage} sur {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={style.pageButton}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
