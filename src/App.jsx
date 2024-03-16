import { MdOutlineReport } from "react-icons/md";
import { FaArrowCircleRight } from "react-icons/fa";
import HistoryBox from "./components/HistoryBox";
import MessageBox from "./components/MessageBox";
import axios from "axios";
import useChatStore from "./store/useChatStore";
import { useEffect, useState } from "react";
import { generate } from "short-uuid";
import Swal from "sweetalert2";

export default function App() {
    const [responseInProgress, setResponseInProgress] = useState(false);
    const [prompt, setPrompt] = useState("");
    const chatStore = useChatStore();

    async function getResponse(question) {
        try {
            if(prompt === "") {
                alert("Please enter something in the prompt!");
                return;
            }

            chatStore.addChatMessage({
                id: generate(),
                text: question,
                isResponse: false
            });

            setResponseInProgress(true);

            const modelResponse = await axios.get(`http://127.0.0.1:5000/respond?question=${question}`, {
                timeout: 50000
            });

            console.log(modelResponse);

            if(modelResponse.status != 200) {
                setResponseInProgress(false);

                chatStore.addChatMessage({
                    id: generate(),
                    text: "Something went wrong, please try again!",
                    isResponse: true
                });
            }
            else {
                chatStore.addChatMessage({
                    id: generate(),
                    text: modelResponse.data,
                    isResponse: true
                })
            }

            setResponseInProgress(false);

            return "Response";
        }
        catch(err) {
            console.log(err);
            return "Error occurred while getting response, please try again"
        }
    }

    useEffect(() => {
        Swal.fire({
            title: "Note",
            text: "Please note that I am using my own API keys in the backend, if the server does not work that means my keys have been exhausted. Please email: aliraza.abro.prog@gmail so that I can see what I can do.",
            icon: "info",
            customClass: {
                content: "text-sm"
            }
        })
    }, [])

    return (
        <div className="min-w-screen min-h-screen flex">
            <div className="w-80 min-h-full flex flex-col items-center p-7 bg-slate-50">
                <div className="w-full flex flex-col items-center">
                    <p className="font-bold text-xl">History</p>
                    <hr className="mt-3 w-full border-gray-300" />
                </div>
                <div className="w-full flex-1">
                    {
                        chatStore.chatMessages
                            .filter(message => !message.isResponse)
                            .map(message => (
                                <HistoryBox key={message?.id} text={message?.text} />
                            ))
                    }
                </div>
                <div className="mt-5 w-full text-center space-y-1">
                    <hr />
                    <p className="text-4xl font-bold text-green-600">Holm</p>
                </div>
            </div>
            <div className="m-3 w-full min-h-full overflow-hidden rounded-md border-[1px] border-gray-300 shadow-lg">
                <div className="w-full border-b-[1px] border-gray-200 shadow-sm flex justify-between items-center p-5">
                    <p className="font-semibold text-xl">Chat</p>
                    <MdOutlineReport size={25} className="text-red-600" />
                </div>
                <div className="min-h-full p-7 bg-slate-100 flex flex-col space-y-4">
                    <div className="space-y-7 flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                        <MessageBox text="Hi There! I am Holm. I am here to assist in any medical related query." isResponse={true} />
                        {
                            chatStore.chatMessages.map(chatMessage => (
                                <MessageBox key={chatMessage?.id} text={chatMessage?.text} isResponse={chatMessage?.isResponse} />
                            ))
                        }
                        { responseInProgress && <MessageBox text="Thinking...." isResponse={true} />}
                    </div>

                    <div className="mx-5 mb-20 max-w-full h-16 flex flex-col">
                        <div className="px-3 space-x-3 border-[1px] border-gray-400 shadow-md rounded bg-white w-full lg:w-2/3 self-center h-full flex items-center">
                            <input type="text" className="w-full outline-none" placeholder="Enter your prompt here" onChange={(e) => setPrompt(e.target.value)} />
                            <FaArrowCircleRight size={35} className="text-green-600 hover:cursor-pointer hover:text-green-700" onClick={() => getResponse(prompt)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}