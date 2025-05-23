import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: 'https://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    }
});

const getPseudo = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    

    const decoded = jwtDecode(token);
    if (!decoded) return null;
    
    const time = decoded.exp;
    if (!time) return null;

    const currentTime = Date.now() / 1000;
    if (currentTime > time) {
        localStorage.removeItem('token');
        alert('Votre session a expiré. Veuillez vous reconnecter.')
        window.location.reload();
        return null;
    }

    const pseudo = decoded.sub;

    if (!pseudo) return null;
    return pseudo;
};

export { api, getPseudo };