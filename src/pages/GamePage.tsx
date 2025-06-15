import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Shuffle from '../assets/shuffle-svgrepo-com.svg';
import CocaColaCap from '../assets/caps-coca.png';
import BannerPortrait from '../assets/portrait-banner.png'; // for desktop
import BannerLandscape from '../assets/landscape-banner.png'; // for mobile


const MAX_SCORE = 30;
const WIN_THRESHOLD = 27;

function GamePage() {
  const [resultText, setResultText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capPositions, setCapPositions] = useState([...Array(9).keys()]);
  const [clickedCap, setClickedCap] = useState<number | null>(null);

  const prizes = ['Water bottle', 'T-shirt', 'Pen', 'COCA-COLA'];

  const handleShuffle = () => {
    setIsModalOpen(false);
    setClickedCap(null); 

    const shuffled = [...capPositions]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    setCapPositions(shuffled);
  }; 

  const handleCapClick = (originalIndex: number) => {
    if (isModalOpen) return;

    setClickedCap(originalIndex);
    console.log(originalIndex);
    

    const score = Math.floor(Math.random() * MAX_SCORE) + 1;
    console.log(score);
    let message = '';

    if (score >= WIN_THRESHOLD) {
      
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      message = `You clicked cap #${originalIndex}. You won a ${randomPrize} with a score of ${score}!`;
    } else {
      message = `You clicked cap #${originalIndex}. You lost with a score of ${score}. Try again!`;
    }

    setResultText(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-white flex flex-col lg:flex-row">
      {/* Left Section: Crown Caps Grid */}
      <div className="flex flex-col lg:w-1/2 lg:h-screen p-10 pt-6">
        {/* Header */}
        <div className="w-full bg-red-800 py-6 px-4 lg:py-6 lg:px-4 text-center flex items-center justify-center h-32 lg:h-48 rounded-lg shadow-lg">
          <h1 className="text-2xl lg:text-4xl font-bold">Coca-Cola Cap Game</h1>
        </div>

        {/* Crown Caps Grid */}
        <div className="grid grid-cols-3 gap-2 p-4 lg:p-0 rounded-lg flex-1 place-items-center max-w-screen-sm mx-auto">
          <AnimatePresence>
            {capPositions.map((originalIndex) => (
              <motion.img
                key={originalIndex}
                layout
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                src={CocaColaCap}
                alt="Coca Cola Cap"
                className="rounded-full cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCapClick(originalIndex)}
              />
            ))}
          </AnimatePresence>
        </div>
        {/* Shuffle Image */}
          <div className="flex flex-col items-center mt-4">
            <motion.img
              src={Shuffle}
              alt="Shuffle Caps"
              title="Shuffle Caps"
              onClick={handleShuffle}
              className="w-12 h-12 rounded-full cursor-pointer bg-red-800 hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </div>
      </div>

      {/* Right Section: Banner */}
      <div className="flex-1 relative overflow-hidden h-64 lg:h-screen">
        {/* Mobile: Landscape image */}
        <img
          src={BannerLandscape}
          alt="Mobile Banner"
          className="block lg:hidden absolute inset-0 w-full h-full object-cover overflow-hidden"
        />

        {/* Desktop: Portrait image */}
        <img
          src={BannerPortrait}
          alt="Desktop Banner"
          className="hidden lg:block absolute inset-0 w-full h-full overflow-hidden"
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              layout
              className="bg-white p-8 rounded-lg shadow-xl text-center w-11/12 max-w-md lg:max-w-lg border-4 border-red-800"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-red-800">Game Result</h2>
              <p className="text-xl lg:text-2xl mb-6 text-gray-800">{resultText}</p>
              <button
                onClick={closeModal}
                className="py-3 px-8 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xl font-semibold transition duration-300 shadow-md"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GamePage;
