import{ useState } from 'react';
import CsvReader from '../components/CSVDisplay';
import ChatInterface from '../components/ChatInterface';
import '../Home.css';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleChat = () => {
    if (isChatOpen) {

      setIsTransitioning(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsTransitioning(false);
      }, 300); 
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="relative">
      <CsvReader />
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
      >
        Chat with me
      </button>
      {isChatOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`bg-white w-full h-full shadow-lg transition-transform duration-300${
              isTransitioning ? 'transform scale-95' : 'transform scale-100'
            }`}
          >
            <ChatInterface  onClose={toggleChat} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
