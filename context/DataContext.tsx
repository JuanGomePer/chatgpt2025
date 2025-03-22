import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore/lite';
import { db } from '@/utils/FireBaseConfig';
import { Message } from '@/interfaces/AppInterfaces';
import { AuthContext } from './AuthContext';

interface DataContextProps {
  chatsList: { id: string; name: string }[];
  currentChatId: string | null;
  messages: Message[];
  loadChats: () => Promise<void>;
  selectChat: (id: string) => Promise<void>;
  createNewChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  addBotMessage: (msg: Message) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const DataContext = createContext<DataContextProps>({
  chatsList: [],
  currentChatId: null,
  messages: [],
  loadChats: async () => {},
  selectChat: async () => {},
  createNewChat: () => {},
  sendMessage: async () => {},
  addBotMessage: async () => {},
  setMessages: () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Se obtiene el usuario actual desde AuthContext en lugar de getAuth()
  const { currentUser } = useContext(AuthContext);
  const [chatsList, setChatsList] = useState<{ id: string; name: string }[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Cargar chats del usuario actual
  const loadChats = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', currentUser.uid)
      );
      const querySnap = await getDocs(q);
      const temp: { id: string; name: string }[] = [];
      querySnap.forEach((docSnap) => {
        const data = docSnap.data();
        temp.push({
          id: docSnap.id,
          name: data?.name || 'Unnamed',
        });
      });
      setChatsList(temp);
    } catch (error) {
      console.log("Error al cargar chats:", error);
    }
  };

  // Seleccionar un chat y cargar sus mensajes
  const selectChat = async (id: string) => {
    setCurrentChatId(id);
    try {
      const chatRef = doc(db, "chats", id);
      const snap = await getDoc(chatRef);
      if (snap.exists()) {
        const data = snap.data();
        setMessages(data?.messages || []);
      } else {
        setMessages([]);
        await setDoc(chatRef, {
          name: "Unnamed Chat",
          created_at: serverTimestamp(),
          messages: [],
          userId: currentUser ? currentUser.uid : null,
        });
      }
    } catch (error) {
      console.log("Error al seleccionar chat:", error);
    }
  };

  // Crear un nuevo chat localmente (sin crear en Firestore hasta que se envíe el primer mensaje)
  const createNewChat = () => {
    const newId = "chat_" + Date.now();
    setCurrentChatId(newId);
    setMessages([]);
  };

  // Enviar mensaje (crea el documento si no existe o lo actualiza)
  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentChatId || !currentUser) return;
    const userMessage: Message = {
      text: text.trim(),
      sender_by: "Me",
      date: new Date(),
      state: "Viewed",
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const chatRef = doc(db, "chats", currentChatId);
      const snap = await getDoc(chatRef);
      if (!snap.exists()) {
        await setDoc(chatRef, {
          name: `Chat ${new Date().toISOString()}`,
          created_at: serverTimestamp(),
          messages: [userMessage],
          userId: currentUser.uid,
        });
        loadChats();
      } else {
        await updateDoc(chatRef, {
          messages: arrayUnion(userMessage),
        });
      }
    } catch (error) {
      console.log("Error al enviar mensaje:", error);
    }
  };

  // Agregar mensaje del bot
  const addBotMessage = async (botMsg: Message) => {
    if (!currentChatId) return;
    setMessages((prev) => [...prev, botMsg]);
    try {
      const chatRef = doc(db, "chats", currentChatId);
      await updateDoc(chatRef, {
        messages: arrayUnion(botMsg),
      });
    } catch (error) {
      console.log("Error al agregar mensaje del bot:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadChats();
    }
  }, [currentUser]);

  return (
    <DataContext.Provider
      value={{
        chatsList,
        currentChatId,
        messages,
        loadChats,
        selectChat,
        createNewChat,
        sendMessage,
        addBotMessage,
        setMessages,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
