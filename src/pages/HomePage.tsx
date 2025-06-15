import { Link } from 'react-router-dom';
import logo from '../assets/inad-logo.png';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-4">
          {/* Logo Image */}
          <img
            src={logo}
            alt="INAD Logo"
            className="mx-auto w-[300px] h-52"
          />
        </div>

        <div className="space-y-4">
          {/* Play Button */}
          <Link to="/game" className="block">
            <button
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-4 px-8 text-xl rounded-lg transition-colors cursor-pointer"
            >
              Play
            </button>
          </Link>

          {/* Settings Button */}
          <button
            className="w-full border-red-700 text-red-700 hover:bg-red-50 font-semibold py-4 px-8 text-xl rounded-lg transition-colors cursor-pointer"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
