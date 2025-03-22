import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { APIResponse } from '@/interfaces/Responses';
import { Message } from '@/interfaces/AppInterfaces';
import { AuthContext } from '@/context/AuthContext';
import { DataContext } from '@/context/DataContext';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore/lite';
import { db } from '@/utils/FireBaseConfig';

export default function PrincipalScreen() {
  const router = useRouter();
  const { currentUser, logout } = useContext(AuthContext);
  const {
    chatsList,
    currentChatId,
    messages,
    loadChats,
    selectChat,
    createNewChat,
    sendMessage,
    setMessages,
  } = useContext(DataContext);

  // Estados locales para controles de interfaz
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatDropdownOpen, setChatDropdownOpen] = useState(false);
  const [inputText, setInputText] = useState("Explain how AI works");
  const [isLoading, setIsLoading] = useState(false);

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/'); // Redirige a la pantalla de bienvenida
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Abre un chat existente utilizando la función del DataContext
  const openChat = async (id: string) => {
    setDrawerOpen(false);
    setChatDropdownOpen(false);
    await selectChat(id);
  };

  // Crea un nuevo chat utilizando la función del DataContext
  const handleNewChat = () => {
    createNewChat();
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleChatDropdown = () => {
    setChatDropdownOpen(!chatDropdownOpen);
  };

  const goBack = () => {
    router.push('/');
  };

  // Envía mensaje usando la función centralizada del DataContext
  const handleSend = async () => {
    if (!inputText.trim() || !currentChatId) return;
    await sendMessage(inputText);
    setInputText("");
    await getResponse(inputText.trim());
  };

  // Función para obtener respuesta del bot (manteniendo la lógica actual)
  const getResponse = async (userMessage: string) => {
    if (!currentChatId) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAf0S-ZNa8_jA2m3wHE0oEkEMTc90qZ3a0",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userMessage }]
              }
            ]
          })
        }
      );
      const data: APIResponse = await response.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      const botMessage: Message = {
        text: botText,
        sender_by: "Bot",
        date: new Date(),
        state: "Received"
      };
      setMessages((prev) => [...prev, botMessage]);
      const chatRef = doc(db, "chats", currentChatId);
      await updateDoc(chatRef, {
        messages: arrayUnion(botMessage)
      });
    } catch (error) {
      console.log("Error al obtener respuesta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateValue: any) => {
    if (dateValue instanceof Date) {
      return dateValue.toLocaleTimeString();
    } else if (dateValue && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleTimeString();
    } else {
      return new Date(dateValue).toLocaleTimeString();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#343541' }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
        <View style={styles.container}>
          {/* Barra superior */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
              <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            {/* Sidebar */}
            {drawerOpen && (
              <View style={styles.drawer}>
                <TouchableOpacity style={styles.drawerItem} onPress={toggleChatDropdown}>
                  <Text style={styles.drawerItemText}>
                    Chat {chatDropdownOpen ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>
                {chatDropdownOpen && (
                  <View style={styles.chatSubList}>
                    <TouchableOpacity style={[styles.drawerItem, styles.subItem]} onPress={handleNewChat}>
                      <Text style={styles.drawerItemText}>New Chat</Text>
                    </TouchableOpacity>
                    {chatsList.map((chat) => (
                      <TouchableOpacity
                        key={chat.id}
                        style={[styles.drawerItem, styles.subItem]}
                        onPress={() => openChat(chat.id)}
                      >
                        <Text style={styles.drawerItemText}>{chat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.drawerItem}>
                  <Text style={styles.drawerItemText}>Clear conversations</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem}>
                  <View style={styles.upgradeRow}>
                    <Text style={styles.drawerItemText}>Upgrade to Plus</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem}>
                  <Text style={styles.drawerItemText}>Light mode</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem}>
                  <Text style={styles.drawerItemText}>Updates & FAQ</Text>
                </TouchableOpacity>

                {/* Botón Logout */}
                <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
                  <Text style={styles.drawerItemText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Área del chat */}
            <View style={styles.chatArea}>
              <ScrollView contentContainerStyle={styles.messagesContainer}>
                {messages.map((msg, index) => {
                  const isMe = msg.sender_by === "Me";
                  return (
                    <View
                      key={index}
                      style={[
                        styles.messageBubble,
                        isMe ? styles.myMessage : styles.botMessage
                      ]}
                    >
                      <Text style={styles.senderText}>{msg.sender_by}</Text>
                      {msg.sender_by === "Bot" ? (
                        <Markdown style={markdownStyles}>
                          {msg.text}
                        </Markdown>
                      ) : (
                        <Text style={styles.messageText}>{msg.text}</Text>
                      )}
                      <Text style={styles.dateText}>{formatDate(msg.date)}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Área del input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything, get your answer"
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>{isLoading ? "..." : "Send"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#343541' },
  container: { flex: 1, backgroundColor: "#343541" },
  topBar: { height: 50, backgroundColor: "#343541", flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  menuButton: { marginRight: 16 },
  menuText: { color: "#fff", fontSize: 24 },
  backButton: {},
  backText: { color: "#fff", fontSize: 16 },
  contentContainer: { flex: 1, flexDirection: "row" },
  drawer: { width: 250, backgroundColor: "#202123", paddingVertical: 16 },
  drawerItem: { paddingVertical: 12, paddingHorizontal: 16 },
  drawerItemText: { color: "#fff", fontSize: 16 },
  chatSubList: { backgroundColor: "#18191A" },
  subItem: { paddingLeft: 32 },
  upgradeRow: { flexDirection: "row", alignItems: "center" },
  newBadge: { backgroundColor: "#ff9800", marginLeft: 8, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  newBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  chatArea: { flex: 1, justifyContent: "center" },
  messagesContainer: { padding: 8, width: "100%" },
  messageBubble: { width: "50%", marginVertical: 4, padding: 12, borderRadius: 8 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#10a37f" },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#444654" },
  senderText: { fontSize: 12, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  messageText: { fontSize: 15, color: "#fff" },
  dateText: { fontSize: 10, color: "#ccc", textAlign: "right", marginTop: 4 },
  inputContainer: { backgroundColor: "#40414F", flexDirection: "row", alignItems: "center", padding: 8 },
  input: { flex: 1, backgroundColor: "#343541", color: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  sendButton: { marginLeft: 8, backgroundColor: "#10a37f", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 4 },
  sendButtonText: { color: "#fff", fontSize: 16 }
});

const markdownStyles = {
  body: { color: '#fff', fontSize: 15, lineHeight: 22 }
};
