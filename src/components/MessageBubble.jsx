import AudioTTSButton from "./AudioTTSButton";
import ReactMarkdown from "react-markdown";


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
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <ReactMarkdown
          components={{
            strong: ({node, ...props}) => (
              <strong className="font-semibold text-green-300" {...props} />
            ),
            h3: ({node, ...props}) => (
              <h3 className="font-bold mt-2 mb-1 text-green-400" {...props} />
            ),
            ul: ({node, ...props}) => (
              <ul className="list-disc pl-4 space-y-1" {...props} />
            ),
            li: ({node, ...props}) => (
              <li className="mb-1" {...props} />
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>

        )}
        
        {!isUser ? 
            <div key={message.id} style={{"display": "flex", "justifyContent": "end", "marginTop": "12px"}}><AudioTTSButton text={message.text} /></div>
             : ""}
      </div>
    </div>
  )
}