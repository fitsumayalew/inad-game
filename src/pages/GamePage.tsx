import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Shuffle from '../assets/shuffle.svg';
import exit from '../assets/exit.svg'
import Modal from '../components/Modal';
import { Link } from '@tanstack/react-router';
import { DEFAULT_SETTINGS, Settings } from '../../worker/helpers';
import { getSettingsFromDB } from '../utils/db';

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

  // Load persisted settings for dynamic images
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const prizes = settings.prizes.filter((p) => p.isActive).map((p) => p.name || p.id);

  // Build prize image map for Modal (identifier -> image string)
  const prizeImages: Record<string, string | null | undefined> = {};
  settings.prizes.forEach((p) => {
    if (p.base64image) {
      prizeImages[(p.name || p.id).toLowerCase()] = p.base64image;
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = await getSettingsFromDB();
        if (stored) {
          setSettings(stored);
          setLoadingSettings(false);
          return;
        }
      } catch (err) {
        console.error('Failed to read settings from IndexedDB', err);
      }
      // If we reach here, we didn't find local settings; fallback to defaults
      setLoadingSettings(false);
    })();
  }, []);

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

  if (loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  const capImageSrc = settings.base64Images.cap;
  const bannerImageSrc = settings.base64Images.banner;
  const headerImageSrc = settings.base64Images.header;
  const loseImageSrc = settings.base64Images.lose;

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
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          {/* Header */}  
          <motion.div 
            className="w-full h-28 sm:h-36 md:h-48 bg-gradient-to-r rounded-2xl shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header glow effect */}
            
            <div className="relative">
              {headerImageSrc ? (
                <img
                  src={headerImageSrc}
                  alt="Game Header"
                  className="w-full h-full object-cover"
                />
              ) : (
                <h1 className="text-3xl lg:text-4xl font-bold text-white text-center">
                  Inad Cap Game
                </h1>
              )}
         
            </div>
          </motion.div>

          {/* Crown Caps Grid */}
          <motion.div 
            className="flex-1 grid grid-cols-3 gap-4 mt-4 place-items-center max-w-xl mx-auto w-full px-10 py-0 rounded-3xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {capPositions.map((originalIndex) => (
                <motion.div
                  key={originalIndex}
                  layout
                  className="relative group w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Cap glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  />
                  
                  <motion.img
                    src={capImageSrc}
                    alt="Coca Cola Cap"
                    className="relative w-full h-full cursor-pointer transform transition-transform duration-300 hover:drop-shadow-2xl object-contain"
                    onClick={handleCapClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <div className="flex justify-between items-center px-2 sm:px-4 md:px-6">
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
                  className="w-6 h-6 sm:w-8 sm:h-6 filter brightness-0 invert"
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
                    src={exit}
                    alt="Exit Game"
                    className="w-6 h-6 sm:w-8 sm:h-6"
                  />
                </div>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Right Section: Banner */}
        <motion.div 
          className="lg:w-1/2 h-1/2 lg:h-screen relative overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
          <img
            src={bannerImageSrc}
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
            loseImageSrc={loseImageSrc}
            prizeImages={prizeImages}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default GamePage;
