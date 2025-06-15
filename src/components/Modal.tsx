import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasWonPrize: boolean;
  prize: string | null;
}

function Modal({ isOpen, onClose, hasWonPrize, prize }: ModalProps) {
  if (!isOpen) return null;

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
                  src={`../asset/${prize?.toLowerCase()}.png`}
                  width={250}
                  height={250}
                  alt="Prize"
                  className="mx-auto"
                />
              </div>
              <p className="text-5xl font-bold font-mono text-red-800">
                Congratulations!
              </p>
              <p className="text-5xl font-bold font-mono text-red-800">
                እንኳን ደስ አላቹ!
              </p>
            </>
          ) : (
            <>
              <div className="text-center m-auto mb-4">
                <img
                  src="/assets/try-again.png"
                  width={250}
                  height={250}
                  alt="Try Again"
                  className="mx-auto"
                />
              </div>
              <p className="text-5xl font-bold font-mono text-red-800">
                Try Again!
              </p>
              <p className="text-5xl font-bold font-mono text-red-800">
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
