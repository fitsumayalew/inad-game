import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import logo from '../assets/inad-logo.png';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden max-sm:px-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          className="text-center space-y-12 max-w-lg w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo Section */}
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-3xl blur-2xl opacity-20 scale-110"></div>
              
              {/* Logo container */}
              <div className="relative">
                <img
                  src={logo}
                  alt="INAD Logo"
                  className="mx-auto w-full h-52 object-contain"
                />
              </div>
            </div>

            {/* Welcome text */}
            <div className="space-y-2">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-[#242021]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Welcome
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to play the Cap Game?
              </motion.p>
            </div>
          </motion.div>

          {/* Buttons Section */}
          <motion.div 
            className="space-y-4 mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Shuffle Game Button */}
            <Link to="/game" className="block">
              <motion.button
                className="group relative w-full bg-[#242021] hover:bg-[#2a2526] text-white font-bold py-6 px-8 text-2xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-[#242021] rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-3xl">🎮</span>
                  <span>Play Shuffle</span>
                  <motion.span
                    className="text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.button>
            </Link>

            {/* Spin Game Button */}
            <Link to="/spin_game" className="block">
              <motion.button
                className="group relative w-full bg-[#242021] hover:bg-[#2a2526] text-white font-bold py-6 px-8 text-2xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-[#242021] rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-3xl">🎡</span>
                  <span>Spin Wheel</span>
                  <motion.span
                    className="text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.button>
            </Link>

            {/* Settings Button */}
            <Link to="/settings" className="block">
              <motion.button
                className="group relative w-full bg-white hover:bg-gray-50 border-2 border-[#242021] text-[#242021] hover:text-[#2a2526] font-semibold py-5 px-8 text-xl rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-2xl">⚙️</span>
                  <span>Settings</span>
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer info */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
         
            </div>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-20"
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
          className="absolute top-32 right-16 text-3xl opacity-20"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🎊
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20 text-3xl opacity-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          🏆
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-12 text-2xl opacity-20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          ⭐
        </motion.div>
      </div>
    </div>
  );
}
