import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-sky-700 rounded-2xl p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-700" : ""}
			`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className={`relative ${isOnline ? "online" : ""}`}>
					<div className='w-12 h-12 rounded-full overflow-hidden'>
						<img
							src={conversation.profilePic || "/default-avatar.png"}
							alt='user avatar'
							className='w-full h-full object-cover'
							onError={(e) => {
								e.target.src = "/default-avatar.png"; // Fallback image
							}}
						/>
					</div>
					{isOnline && (
						<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
					)}
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-gray-200'>{conversation.username}</p>
						<span className='text-xl'>{emoji}</span>
					</div>
				</div>
			</div>

			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
		</>
	);
};
export default Conversation;