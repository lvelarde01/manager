import React,{createContext,useState} from "react";

const MessageContext = createContext();


const IninitialMessage = ({ready:false,msgtype:'success',message:'default'});
const MessageProvider = ({children}) =>{
    const [Message,setMessage] = useState(IninitialMessage);

    const handlerMessage = (data)=>{
        if (data.message !== Message.message  || data.message !== Message.msgtype  || data.message !== Message.ready  && data !== undefined) {
            setMessage({...data});
        }

    }

    const data = {Message,handlerMessage};
    return <MessageContext.Provider value={data}>{children}</MessageContext.Provider>;
}  

export {MessageProvider};
export default MessageContext;