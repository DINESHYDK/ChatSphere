const messages = [
  {
    id: 1,
    text: "Hey! How are you doing today?",
    sender: "other",
    time: "10:30 AM",
  },
  {
    id: 2,
    text: "I'm doing great, thanks for asking! Just finished up some work.",
    sender: "me",
    time: "10:32 AM",
  },
  {
    id: 3,
    text: "That's awesome! Do you have time to catch up later?",
    sender: "other",
    time: "10:33 AM",
  },
  {
    id: 4,
    text: "I should be free around 3pm. Does that work for you?",
    sender: "me",
    time: "10:35 AM",
  },
  {
    id: 5,
    text: "Perfect! Let's meet at the usual coffee shop then 😊",
    sender: "other",
    time: "10:36 AM",
  },
  {
    id: 6,
    text: "Sounds like a plan! See you there.",
    sender: "me",
    time: "10:37 AM",
  },
  {
    id: 7,
    text: "By the way, did you see the new project proposal?",
    sender: "other",
    time: "10:40 AM",
  },
  {
    id: 8,
    text: "Yes I did! It looks really promising. I think we should discuss it when we meet.",
    sender: "me",
    time: "10:42 AM",
  },
];

export default function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-3 bg-muted/30">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
              message.sender === "me"
                ? "bg-[#DCF8C6]  text-foreground rounded-br-md"
                : "bg-background text-foreground rounded-bl-md border border-border"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            <span
              className={`text-[10px] mt-1 block text-right ${
                message.sender === "me"
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {message.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
