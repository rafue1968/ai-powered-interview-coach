import AudioTTSButton from "./AudioTTSButton"

export default function MessageBubble({message}) {
  const isUser = message.sender === "user";

  
  return (
    <div style={{textAlign: isUser ? "right" : "left", margin: "12px"}}>
      <div
        style={{
          display: "inline-block",
          padding: "12px",
          borderRadius: "10px",
          backgroundColor: isUser ? "#214108" : "#242121",
          // width: "400px"
        }}
      >
        {message.text}
        
        {!isUser ? 
            <div key={message.id} style={{"display": "flex", "justifyContent": "end", "marginTop": "12px"}}><AudioTTSButton text={message.text} /></div>
             : ""}
      </div>
    </div>
  )
}