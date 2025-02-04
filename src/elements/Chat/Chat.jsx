import React, { useEffect, useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';
import style from './Chat.module.css';

export default function Chat(props) {
    const { class_id, utilisateur } = props;

    const [newMessage, setNewMessage] = useState('');
    const messagesRef = collection(db, "messages");
    const [messagesList, setMessagesList] = useState([]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messagesList]);

    useEffect(() => {
        const queryMessages = query(messagesRef, where("class_id", "==", class_id), orderBy("date_envoi"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id })
            });
            setMessagesList(messages);
        });

        return () => unsubscribe();
    }, [class_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;  // Empêche d'envoyer des messages vides

        await addDoc(messagesRef, {
            text: newMessage,
            date_envoi: serverTimestamp(),
            utilisateur: utilisateur,
            class_id: class_id
        });
        setNewMessage('');
    }

    return (
        <div className={style.chat} ref={chatContainerRef}>
            <div>
                {messagesList.map((message) => (
                    <div key={message.id}>
                        <p className={style.pseudo}>{message.utilisateur} :</p>
                        <p className={style.texte}>{message.text}</p>
                        <p className={style.date}>{new Date(message.date_envoi?.seconds * 1000).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Saisissez votre message..."
                    value={newMessage}
                    aria-label="Message Input"
                />
                <button type="submit" disabled={!newMessage.trim()}>Envoyer</button>
            </form>
        </div>
    )
}
