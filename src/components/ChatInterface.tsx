import React, { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()!== '') {
      const newMessage: Message = {
        text: inputValue,
        sender: 'user',
      };
      setMessages(messages => [...messages, newMessage]);
  
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5005/generate_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get bot response');
      }
  
      const responseData = await response.json();
      const botResponse = responseData.response;
  
   
      const botMessage: Message = {
        text: botResponse,
        sender: 'bot',
      };
      setMessages(messages => [...messages, botMessage]); 
  
      setIsLoading(false);
  
      setInputValue(''); 
    }
  };
  
  const LoaderComponent = () => (
    <div className="loader">Processing...</div>
  );

  return (
    <div className="flex flex-col h-screen relative bg-white">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 z-10"
      >
        Close
      </button>
      <div className="flex-1 overflow-y-auto p-4 mt-10" style={{ maxHeight: '80vh' }}> {/* Adjusted style here */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === 'user'? 'justify-end' : 'justify-start'
            } flex mb-4`}
          >
            <div
              className={`${
                message.sender === 'user'
                ? 'bg-blue-500 text-white'
                  : 'bg-green-100 text-gray-700'
              } w-1/3 rounded-lg p-2`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && <LoaderComponent />}
      </div>
      <div className="flex justify-between items-center border-t border-gray-200 p-2 absolute bottom-0 left-0 w-full">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 appearance-none rounded-full py-2 px-4 mr-2 bg-gray-100 focus:outline-none focus:bg-white"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}  

export default ChatInterface;
