import { motion } from 'framer-motion';
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
}

function Modal({ isOpen, onClose, hasWonPrize, prize, loseImageSrc, prizeImages }: ModalProps) {
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
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative w-contain mx-4 max-w-5xl text-center p-6 bg-transparent border-none"
        >
          {hasWonPrize ? (
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
              <p className="text-5xl font-bold font-mono text-white">
                Congratulations!
              </p>
              <p className="text-5xl font-bold font-mono text-white">
                እንኳን ደስ አላቹ!
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
              <p className="text-5xl font-bold font-mono text-white">
                Try Again!
              </p>
              <p className="text-5xl font-bold font-mono text-white">
                እንደገና ይሞክሩ!
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
