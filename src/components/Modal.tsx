import { motion } from 'framer-motion';
import { Fireworks } from '@fireworks-js/react';
import { Link } from '@tanstack/react-router';
// No static imports; images are expected to come from IndexedDB via props.

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasWonPrize: boolean;
  prize: string | null;
  /** Optional custom image to show when the player loses */
  loseImageSrc?: string;
  /** Optional map of prize identifiers -> base64 image strings (loaded from settings) */
  prizeImages?: Record<string, string | null | undefined>;
  /** Optional texts for win / lose messages (loaded from settings) */
  texts?: import("../../worker/helpers").Texts;
  /** Whether all prizes are depleted and we should show the empty state */
  noPrizesLeft?: boolean;
  /** Game type: 'spin' or 'shuffle' */
  gameType?: 'spin' | 'shuffle';
}

function Modal({ isOpen, onClose, hasWonPrize, prize, loseImageSrc, prizeImages, texts, noPrizesLeft, gameType }: ModalProps) {
  if (!isOpen) return null;

  const getPrizeImage = (prizeId: string | null) => {
    if (!prizeId) return loseImageSrc;

    const id = prizeId.toLowerCase();

    // 1. Attempt to use dynamic image provided via settings (IndexedDB)
    if (prizeImages && prizeImages[id]) {
      return prizeImages[id]!;
    }

    // 2. Otherwise use the lose image or undefined
    return loseImageSrc;
  };

  // Determine messages based on provided texts or fallback to defaults
  const winMessageEn = texts?.en?.win;
  const winMessageAm = texts?.am?.win;
  const loseMessageEn = texts?.en?.lose;
  const loseMessageAm = texts?.am?.lose;

  if (noPrizesLeft) {
    return (
      <>
        <motion.div
          key="modal-noprize"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 max-w-xl w-full text-center p-8 bg-white rounded-2xl shadow-lg"
          >
            <p className="text-2xl font-semibold text-red-600 mb-6">
              No prizes to gift. Please add more prizes.
            </p>
            <Link to="/">
              <button
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Exit
              </button>
            </Link>
          </motion.div>
        </motion.div>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black opacity-80 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto"
        onClick={onClose}
      >
        {/* Fireworks effect when the player wins */}
        {hasWonPrize && (
          <Fireworks
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            options={{
              opacity: 0.5,
              sound: {
                  enabled: true,
                  volume: {
                      min: 40,
                      max: 80,
                  },
                  files: [
                      'music/explosion0.mp3',
                      'music/explosion1.mp3',
                      'music/explosion2.mp3',
                  ],
              },
            }}
          />
        )}
       <motion.div
  onClick={(e) => e.stopPropagation()}
  className="relative w-full mx-4 max-w-5xl text-center p-6 bg-transparent border-none"
>
  {/* Conditionally render for spin game: always show the image for the selected segment, and show win/lose text */}
  {gameType === 'spin' ? (
    <>
      <div className="text-center m-auto mb-4">
        <img
          src={getPrizeImage(prize)}
          width={250}
          height={250}
          alt="Prize"
          className="mx-auto"
        />
      </div>
      {hasWonPrize ? (
        <>
          <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
            {winMessageEn}
          </p>
          <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
            {winMessageAm}
          </p>
        </>
      ) : (
        <>
          <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
            {loseMessageEn}
          </p>
          <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
            {loseMessageAm}
          </p>
        </>
      )}
    </>
  ) : hasWonPrize ? (
    <>
      <div className="text-center m-auto mb-4">
        <img
          src={getPrizeImage(prize)}
          width={250}
          height={250}
          alt="Prize"
          className="mx-auto"
        />
      </div>
      <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
        {winMessageEn}
      </p>
      <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
        {winMessageAm}
      </p>
    </>
  ) : (
    <>
      <div className="text-center m-auto mb-4">
        <img
          src={loseImageSrc}
          width={250}
          height={250}
          alt="Try Again"
          className="mx-auto"
        />
      </div>
      <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
        {loseMessageEn}
      </p>
      <p className="w-full text-base sm:text-4xl md:text-5xl font-bold font-mono text-white break-words md:break-all">
        {loseMessageAm}
      </p>
    </>
  )}
</motion.div>
      </motion.div>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black opacity-80 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
    </>
  );
}

export default Modal;
