import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Shuffle from '../assets/shuffle-svgrepo-com.svg';
import exitButton from '../assets/exit-door-run-escape-svgrepo-com.svg'
import CocaColaCap from '../assets/caps-coca.png';
import BannerLandscape from '../assets/landscape-banner.png';
import Modal from '../components/Modal';
import { Link } from '@tanstack/react-router';

const MAX_SCORE = 30;
const WIN_THRESHOLD = 27;
const SHUFFLE_TIMES = 6; 
const SHUFFLE_INTERVAL = 300;

function GamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capPositions, setCapPositions] = useState([...Array(9).keys()]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [hasWonPrize, setHasWonPrize] = useState(false);

  const prizes = ['bottle', 'cap', 'key', 'Pen',];

  const handleShuffle = () => {
    if (isModalOpen || isAnimating) return;

    setIsModalOpen(false);
    setIsAnimating(true);

    let shuffleCount = 0;

    const intervalId = setInterval(() => {
      setCapPositions(prevPositions => {
        const shuffled = [...prevPositions]
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        return shuffled;
      });

      shuffleCount++;
      if (shuffleCount >= SHUFFLE_TIMES) {
        clearInterval(intervalId);
        setIsAnimating(false);
      }
    }, SHUFFLE_INTERVAL);
  };

  const handleCapClick = () => {
    if (isModalOpen) return;

    const score = Math.floor(Math.random() * MAX_SCORE) + 1;

    if (score >= WIN_THRESHOLD) {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setPrize(randomPrize);
      setHasWonPrize(true);
    } else {
      setPrize(null);
      setHasWonPrize(false);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-white flex flex-col lg:flex-row">
      {/* Left Section: Crown Caps Grid */}
      <div className="flex flex-col lg:w-1/2 lg:h-screen p-10 pt-6 relative">
        {/* Header */}
        <div className="w-full bg-red-800 py-6 px-4 lg:py-6 lg:px-4 text-center flex items-center justify-center h-32 lg:h-48 rounded-lg shadow-lg">
          <h1 className="text-2xl lg:text-4xl font-bold">Coca-Cola Cap Game</h1>
        </div>

        {/* Crown Caps Grid */}
        <div className="grid grid-cols-3 gap-2 mt-10 p-4 lg:p-0 rounded-lg flex-1 place-items-center max-w-screen-sm mx-auto h-full">
          <AnimatePresence>
            {capPositions.map((originalIndex) => (
              <motion.img
                key={originalIndex}
                layout
                transition={{ 
                  type: 'spring', 
                  stiffness: 100, 
                  damping: 20,
                  filter: { duration: 0.2 }
                }}
                src={CocaColaCap}
                alt="Coca Cola Cap"
                className="rounded-full cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCapClick}
              />
            ))}
          </AnimatePresence>
        </div>
        {/* Shuffle Image */}
        
        <div className="absolute bottom-4 left-4">
          <motion.img
            src={Shuffle}
            alt="Shuffle Caps"
            title="Shuffle Caps"
            onClick={handleShuffle}
            className={`w-12 h-12 rounded-full cursor-pointer transition-colors ${
              isAnimating ? 'opacity-50 cursor-not-allowed' : 'bg-red-800 hover:bg-red-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        </div>

        <Link to="/" className="block">
          <div className="absolute bottom-4 right-10">
            <motion.img
              src={exitButton}
              alt="exit button"
              title="exit button"
              className="w-12 h-12 rounded-full cursor-pointer transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />  
          </div>
        </Link>
      </div>

      {/* Right Section: Banner */}
      <div className="flex-1 relative overflow-hidden h-64 lg:h-screen">
        <img
          src={BannerLandscape}
          alt="Mobile Banner"
          className="block absolute inset-0 w-full h-full object-cover overflow-hidden"
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            hasWonPrize={hasWonPrize}
            prize={prize}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default GamePage;
