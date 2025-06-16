import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Shuffle from '../assets/shuffle-2-svgrepo-com.svg';
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

  const prizes = ['bottle', 'cap', 'key', 'Pen'];

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.5, 0.7],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section: Crown Caps Grid */}
        <div className="flex-1 flex flex-col p-6 lg:p-10">
          {/* Header */}  
          <motion.div 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 py-6 px-4 rounded-2xl shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 blur-xl opacity-30"></div>
            
            <div className="relative">
              <h1 className="text-3xl lg:text-4xl font-bold text-white text-center">
                Coca-Cola Cap Game
              </h1>
              <p className="text-red-100 text-center mt-2 text-lg">
                Pick a cap to try your luck!
              </p>
            </div>
          </motion.div>

          {/* Crown Caps Grid */}
          <motion.div 
            className="flex-1 grid grid-cols-3 gap-6 mt-10 place-items-center max-w-2xl mx-auto w-full p-6 bg-white/50 rounded-3xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {capPositions.map((originalIndex) => (
                <motion.div
                  key={originalIndex}
                  layout
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Cap glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  />
                  
                  <motion.img
                    src={CocaColaCap}
                    alt="Coca Cola Cap"
                    className="relative cursor-pointer transform transition-transform duration-300 hover:drop-shadow-2xl"
                    onClick={handleCapClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <div className="mt-8 flex justify-between items-center px-4">
            {/* Shuffle Button */}
            <motion.button
              onClick={handleShuffle}
              disabled={isAnimating}
              className={`group relative rounded-2xl p-4 cursor-pointer ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center space-x-2 text-white">
                <img
                  src={Shuffle}
                  alt="Shuffle Caps"
                  className="w-8 h-6 filter brightness-0 invert"
                />
              </div>
            </motion.button>

            {/* Exit Button */}
            <Link to="/">
              <motion.button
                className="group relative rounded-2xl p-4 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-white rounded-2xl shadow-md group-hover:shadow-lg transition-shadow" />
                <div className="relative flex items-center space-x-2 text-red-600">
                  <img
                    src={exitButton}
                    alt="Exit Game"
                    className="w-8 h-6"
                  />
                </div>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Right Section: Banner */}
        <motion.div 
          className="lg:w-1/2 h-64 lg:h-screen relative overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
          <img
            src={BannerLandscape}
            alt="Game Banner"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-4xl opacity-20 pointer-events-none"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🎲
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-20 text-3xl opacity-20 pointer-events-none"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        🎯
      </motion.div>

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
