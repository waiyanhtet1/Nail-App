// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { IonIcon } from "@ionic/react";
// import axios from "axios";
// import { arrowBackOutline, linkOutline, sendOutline } from "ionicons/icons";
// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { StreamChat } from "stream-chat";
// import ChatMessage from "../../components/chat/ChatMessage";
// import { BASE_URL } from "../../constants/baseUrl";
// import { getLoginUser } from "../../libs/userUtils";

// const LOCAL_STORAGE_INITIALIZED_USER_KEY = "chatChannelInitializedForUser";

// const ChattingScreen = () => {
//   const messageListRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const [messages, setMessages] = useState<any[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userInfo = getLoginUser();

//   const [channelId, setChannelId] = useState("");
//   const [channel, setChannel] = useState<any>(null);
//   const [initializedUserId, setInitializedUserId] = useState<string | null>(
//     () => {
//       try {
//         return localStorage.getItem(LOCAL_STORAGE_INITIALIZED_USER_KEY) || null;
//       } catch {
//         return null;
//       }
//     }
//   );

//   const fetchMessageList = async () => {
//     if (!channelId) return;
//     try {
//       const res = await axios.get(`${BASE_URL}/stream/messages/${channelId}`);
//       const formatted = res.data.map((msg: any) => ({
//         sender:
//           msg.user?.id === userInfo._id
//             ? userInfo.name
//             : msg.user?.name || "Admin",
//         text: msg.text,
//         photoPath:
//           msg.attachments?.[0]?.type === "image"
//             ? msg.attachments[0].image_url
//             : undefined,
//       }));
//       setMessages(formatted.reverse());
//     } catch (err) {
//       console.error("Fetch messages failed:", err);
//     }
//   };

//   useEffect(() => {
//     if (channelId) fetchMessageList();
//   }, [channelId]);

//   useEffect(() => {
//     fetchMessageList();
//   }, [location.pathname]);

//   useEffect(() => {
//     const shouldInitialize =
//       userInfo?._id && initializedUserId !== userInfo._id;
//     if (!shouldInitialize) return;

//     const initialize = async () => {
//       try {
//         const client = new StreamChat("rnbk7rg4kncg");
//         await client.connectUser(
//           {
//             id: userInfo._id,
//             name: userInfo.username,
//             image: userInfo.profileImage,
//           },
//           userInfo.streamToken
//         );

//         const { data } = await axios.post(`${BASE_URL}/stream/channel`, {
//           customerId: userInfo._id,
//         });
//         const { channelId, channelType = "messaging" } = data;
//         const newChannel = client.channel(channelType, channelId);
//         await newChannel.watch();

//         setChannel(newChannel);
//         setChannelId(channelId);

//         newChannel.on("message.new", (event) => {
//           const msg = event.message;
//           setMessages((prev) => [
//             ...prev,
//             {
//               sender:
//                 msg.user?.id === userInfo._id
//                   ? userInfo.name
//                   : msg.user?.name || "Admin",
//               text: msg.text,
//               photoPath:
//                 msg.attachments?.[0]?.type === "image"
//                   ? msg.attachments[0].image_url
//                   : undefined,
//             },
//           ]);
//         });

//         setInitializedUserId(userInfo._id);
//       } catch (err) {
//         console.error("Chat initialization failed:", err);
//       }
//     };

//     initialize();

//     return () => {
//       StreamChat.getInstance().disconnectUser();
//       setMessages([]);
//       setChannel(null);
//       setChannelId("");
//     };
//   }, [userInfo, initializedUserId]);

//   useEffect(() => {
//     if (initializedUserId) {
//       localStorage.setItem(
//         LOCAL_STORAGE_INITIALIZED_USER_KEY,
//         initializedUserId
//       );
//     } else {
//       localStorage.removeItem(LOCAL_STORAGE_INITIALIZED_USER_KEY);
//     }
//   }, [initializedUserId]);

//   useEffect(() => {
//     return () => imagePreview && URL.revokeObjectURL(imagePreview);
//   }, [imagePreview]);

//   useEffect(() => {
//     messageListRef.current?.scrollTo({
//       top: messageListRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || !channel || !userInfo?._id) return;
//     const payload = {
//       channelId: channel.id,
//       userId: userInfo._id,
//       text: inputValue.trim(),
//     };
//     try {
//       await axios.post(`${BASE_URL}/stream/send-message`, payload);
//       setInputValue("");
//       inputRef.current?.focus();
//     } catch (err) {
//       console.error("Send message failed:", err);
//     }
//   };

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file?.type.startsWith("image/")) {
//       if (imagePreview) URL.revokeObjectURL(imagePreview);
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleCancelImage = () => {
//     if (imagePreview) URL.revokeObjectURL(imagePreview);
//     setImageFile(null);
//     setImagePreview(null);
//   };

//   const handleImageUpload = async () => {
//     if (!imageFile || !channel) return;
//     try {
//       await channel.sendImage(imageFile);
//       handleCancelImage();
//     } catch (err) {
//       console.error("Image upload failed:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="mt-10 mx-5 flex items-center">
//         <IonIcon
//           icon={arrowBackOutline}
//           className="size-6"
//           onClick={() => navigate(-1)}
//         />
//         <p className="text-secondary font-bold text-center flex justify-center w-full">
//           Chat with Barbie’s Studio
//         </p>
//       </div>

//       <div
//         ref={messageListRef}
//         className="flex-1 px-5 py-5 flex flex-col gap-3 overflow-y-auto no-scrollbar"
//       >
//         {messages.map((msg, index) => (
//           <ChatMessage
//             key={index}
//             variant={msg.sender === userInfo?.name ? "send" : "receive"}
//             message={msg.text}
//             senderName={msg.sender === userInfo?.name ? userInfo.name : ""}
//             photo={msg.photoPath}
//           />
//         ))}
//       </div>

//       {imagePreview && (
//         <div className="px-5 mt-2 relative">
//           <img src={imagePreview} alt="Preview" className="w-40 rounded-lg" />
//           <button
//             onClick={handleCancelImage}
//             className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
//           >
//             ✕
//           </button>
//           <button
//             onClick={handleImageUpload}
//             className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded"
//           >
//             Upload Image
//           </button>
//         </div>
//       )}

//       <div className="sticky bottom-0 w-full px-3 pb-5 pt-3">
//         <div className="bg-white rounded-xl p-3 flex items-center gap-5 border border-gray-200 shadow-sm">
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Type your text message"
//             className="w-full outline-none text-sm"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//           />

//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             id="image-upload"
//             onChange={handleImageSelect}
//           />
//           <label htmlFor="image-upload">
//             <IonIcon
//               icon={linkOutline}
//               className="size-6 cursor-pointer pt-1.5"
//             />
//           </label>

//           <IonIcon
//             icon={sendOutline}
//             className={`size-6 ${
//               !inputValue.trim() ? "opacity-30" : "cursor-pointer"
//             }`}
//             onClick={handleSendMessage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChattingScreen;
