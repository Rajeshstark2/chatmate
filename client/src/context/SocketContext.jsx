import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [messages, setMessages] = useState([]); // ✅ Store received messages
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io("https://chatmate-dc97.onrender.com", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// ✅ Listen for online users update
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// ✅ Listen for incoming messages in real time
			socket.on("receiveMessage", (message) => {
				setMessages((prev) => [...prev, message]);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	// ✅ Function to send messages
	const sendMessage = (receiverId, message) => {
		if (socket) {
			socket.emit("sendMessage", {
				senderId: authUser._id,
				receiverId,
				message,
			});
		}
	};

	return (
		<SocketContext.Provider value={{ socket, onlineUsers, messages, sendMessage }}>
			{children}
		</SocketContext.Provider>
	);
};
