import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Shuffle from "../assets/shuffle.svg";
import exit from "../assets/exit.svg";
import Modal from "../components/Modal";
import { Link } from "@tanstack/react-router";
import { DEFAULT_SETTINGS, Settings } from "../../worker/helpers";
import { getSettingsFromDB, saveSettingsToDB } from "../utils/db";

const SHUFFLE_TIMES = 6; 
const SHUFFLE_INTERVAL = 300;

function GamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capPositions, setCapPositions] = useState([...Array(9).keys()]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flippedCaps, setFlippedCaps] = useState<
    { index: number; prize: string }[]
  >([]);
  const [isWin, setIsWin] = useState(false);
  const [noPrizesLeft, setNoPrizesLeft] = useState(false);

  // Load persisted settings for dynamic images
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Build prize image map for Modal (identifier -> image string)
  const prizeImages: Record<string, string | null | undefined> = {};
  settings.shufflePrizes.forEach((p) => {
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
        console.error("Failed to read settings from IndexedDB", err);
      }
      // If we reach here, we didn't find local settings; fallback to defaults
      setLoadingSettings(false);
    })();
  }, []);

  // Re-evaluate whether there are prizes left whenever settings change
  useEffect(() => {
    if (loadingSettings) return;
    const anyAvailable = settings.shufflePrizes.some(
      (p) => p.isActive && p.amount > 0
    );
    setNoPrizesLeft(!anyAvailable);
    if (!anyAvailable) {
      // Open the modal automatically if everything is depleted
      setIsModalOpen(true);
    }
  }, [settings, loadingSettings]);

  const handleShuffle = () => {
    if (noPrizesLeft || isAnimating) return;

    setIsModalOpen(false);
    setIsAnimating(true);

    let shuffleCount = 0;

    const intervalId = setInterval(() => {
      setCapPositions((prevPositions) => {
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

  const handleCapClick = (index: number) => {
    if (noPrizesLeft || isModalOpen || isAnimating) return;
    if (flippedCaps.find((c) => c.index === index) || flippedCaps.length >= 2)
      return;

    // Get available active and inactive prizes
    const activePrizes = settings.shufflePrizes.filter(
      (p) => p.isActive && p.amount > 0
    );
    const inactivePrizes = settings.shufflePrizes.filter(
      (p) => !p.isActive || p.amount === 0
    );

    if (activePrizes.length === 0) return;

    // For the first flip, always select from active prizes
    if (flippedCaps.length === 0) {
      const selected =
        activePrizes[Math.floor(Math.random() * activePrizes.length)];

        // Deduct one from the prize amount
        const updatedPrizes = settings.shufflePrizes.map((p) =>
          p.id === selected.id ? { ...p, amount: Math.max(p.amount - 1, 0) } : p
        );
        const updatedSettings = { ...settings, shufflePrizes: updatedPrizes };
        setSettings(updatedSettings);
        saveSettingsToDB(updatedSettings);

      setFlippedCaps([{ index, prize: selected.name || selected.id }]);
    } else {
      // For the second flip, use probability to determine win/lose
      const firstPrize = flippedCaps[0].prize;
      let secondPrize: string;

      // Determine if player wins based on probability
      const isWinningFlip = Math.random() < settings.shuffleWinningProbability;

      if (isWinningFlip) {
        // If winning, show the same prize
        secondPrize = firstPrize;
      } else {
        // different prizes that are active
        const differentActivePrizes = activePrizes.filter(
          (p) => (p.name || p.id) !== firstPrize
        );

        // different prizes that are inactive
        const differentInactivePrizes = inactivePrizes.filter(
          (p) => (p.name || p.id) !== firstPrize && p.base64image !== null
        );

        if (differentActivePrizes.length > 0) {
          // Get all active prizes that are different from the first prize

          const randomPrize =
            differentActivePrizes[
              Math.floor(Math.random() * differentActivePrizes.length)
            ];
          secondPrize = randomPrize.name || randomPrize.id;
        } else if (differentInactivePrizes.length > 0) {
          const randomPrize =
            differentInactivePrizes[
              Math.floor(Math.random() * differentInactivePrizes.length)
            ];

          secondPrize = randomPrize.name || randomPrize.id;
        } else {
          secondPrize = settings.shuffleImages.lose2; // fallback if no different prizes found
        }
      }

      const newFlipped = [...flippedCaps, { index, prize: secondPrize }];
      setFlippedCaps(newFlipped);

      // After a short delay, show modal with win/lose
      setTimeout(() => {
        setIsWin(newFlipped[0].prize === newFlipped[1].prize);
        setIsModalOpen(true);
      }, 800);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFlippedCaps([]);
    setIsWin(false);
    // Optionally shuffle caps after closing modal
    if (!noPrizesLeft) {
      handleShuffle();
    }
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  const capImageSrc = settings.shuffleImages.cap;
  const bannerImageSrc = settings.shuffleImages.banner;
  const headerImageSrc = settings.shuffleImages.header;
  const loseImageSrc = settings.shuffleImages.lose;
  const backCapImageSrc = settings.shuffleImages.backCap;

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
            ease: "easeInOut",
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
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section: Crown Caps Grid */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          {/* Header */}  
          <motion.div
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
            className="flex-1 grid grid-cols-3 gap-1 mt-2 place-items-center max-w-xl mx-auto w-full rounded-3xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {capPositions.map((originalIndex) => {
                const flipped = flippedCaps.find(
                  (c) => c.index === originalIndex
                );
                return (
                <motion.div
                  key={originalIndex}
                  layout
                  className="relative group lg:size-32 md:size-28 size-24"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Cap glow effect */}
                    <motion.div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <motion.div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => handleCapClick(originalIndex)}
                    animate={{
                        rotateY: flipped ? 180 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front side (default) */}
                    <motion.img
                      src={capImageSrc}
                      alt="Coca Cola Cap"
                      className="absolute w-full h-full backface-hidden object-contain"
                      style={{ backfaceVisibility: "hidden" }}
                    />
                    {/* Back side (front of cap) */}
                    <motion.div
                      className="absolute w-full h-full backface-hidden"
                      style={{ 
                        backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                      }}
                    >
                      <img
                        src={backCapImageSrc}
                        alt="Coca Cola Cap Front"
                        className="absolute w-full h-full object-contain"
                      />
                        {flipped && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                              src={
                                prizeImages[flipped.prize.toLowerCase()] ?? ""
                              }
                              alt={flipped.prize}
                              className="w-1/2 h-1/2 object-contain"
                            />
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <div className="flex justify-between items-center px-10 sm:px-4 md:px-16">
            {/* Shuffle Button */}
            <motion.button
              onClick={handleShuffle}
              disabled={isAnimating || noPrizesLeft || flippedCaps.length === 1}
              className={`group relative rounded-2xl p-4 cursor-pointer ${
                isAnimating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-[#242021] rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
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
                <div className="relative flex items-center space-x-2">
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
          rotate: [0, 10, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🎲
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-20 text-3xl opacity-20 pointer-events-none"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
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
            hasWonPrize={isWin}
            prize={isWin ? (flippedCaps[0]?.prize ?? null) : null}
            loseImageSrc={loseImageSrc}
            prizeImages={prizeImages}
            texts={settings.texts}
            noPrizesLeft={noPrizesLeft}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default GamePage;
