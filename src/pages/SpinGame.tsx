/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getSettingsFromDB, saveSettingsToDB } from '../utils/db';
import { DEFAULT_SETTINGS, Settings } from '../../worker/helpers';
import exit from '../assets/exit.svg';


export default function SpinGame() {
    const [audio] = useState(new Audio('/music/drumroll.mp3'));
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [spining, setSpining] = useState(false);
    const [won, setWon] = useState(false);
    const [prize, setPrize] = useState<any>(null);
    const [degree, setDegree] = useState(0);
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Build prizeImages map for Modal (identifier -> image string)
    const prizeImages: Record<string, string | null | undefined> = {};
    settings.spinPrizes.forEach((p) => {
      if (p.base64image) {
        prizeImages[(p.name || p.id).toLowerCase()] = p.base64image;
      }
    });
   

    // Load settings on component mount
    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await getSettingsFromDB();
            if (savedSettings) {
                setSettings(savedSettings);
            }
        };
        loadSettings();
    }, []);

    function onSpinClicked() {
        if (spining) return;
        // Filter active prizes with amount > 0
        const availablePrizes = settings.spinPrizes.filter(prize => prize.isActive && prize.amount > 0);
        const losePrizeIds = ['2', '4', '6', '8'];
        const availableWinningPrizes = availablePrizes.filter(prize => !losePrizeIds.includes(prize.id));
        // For lose, allow any lose-segment prize, active or inactive
        const allLosePrizes = settings.spinPrizes.filter(prize => losePrizeIds.includes(prize.id));

        if (availablePrizes.length === 0 || availableWinningPrizes.length === 0 || allLosePrizes.length === 0) {
            return;
        }
        audio.currentTime = 0;
        audio.play();

        // Decide win/lose by probability
        const isWin = Math.random() < settings.shuffleWinningProbability;
        let selectedPrize;
        if (isWin) {
            // Pick a random winning prize (active, not lose segment)
            selectedPrize = availableWinningPrizes[Math.floor(Math.random() * availableWinningPrizes.length)];
        } else {
            // Pick a random lose prize (any lose segment, active or inactive)
            selectedPrize = allLosePrizes[Math.floor(Math.random() * allLosePrizes.length)];
        }

        // Find the index of the selected prize in the spinPrizes array
        const selectedIndex = settings.spinPrizes.findIndex(p => p.id === selectedPrize.id);
        // Calculate the degree so the wheel lands on the selected prize
        const segmentAngle = 360 / settings.spinPrizes.length;
        // Add extra spins for animation (e.g., 14 full spins)
        const extraSpins = 14 * 360;
        // The wheel is drawn in reverse order, so we need to reverse the index
        const visualIndex = settings.spinPrizes.length - selectedIndex - 1;
        const deg = extraSpins + visualIndex * segmentAngle + segmentAngle / 2;

        setPrize(selectedPrize);
        setDegree(deg);
        setSpining(true);
    }

    // When the spin ends, open the modal
    function handleSpinEnd() {
        setSpining(false);
        setWon(true);
        // Only decrease prize amount if the player wins
        const losePrizeIds = ['2', '4', '6', '8'];
        if (prize && !losePrizeIds.includes(prize.id)) {
            const updatedPrizes = settings.spinPrizes.map((p) =>
                p.id === prize.id ? { ...p, amount: p.amount - 1 } : p
            );
            const updatedSettings = { ...settings, spinPrizes: updatedPrizes };
            setSettings(updatedSettings);
            saveSettingsToDB(updatedSettings);
        }
        setIsModalOpen(true);
    }

    // For closing the modal
    function closeModal() {
        setIsModalOpen(false);
        setWon(false);
        setPrize(null);
    }

    // Prizes with id '2', '4', '6', '8' are lose segments
    const losePrizeIds = ['2', '4', '6', '8'];
    const hasWonPrize = prize && !losePrizeIds.includes(prize.id);
    const wheelImageSrc = settings.spinImages.wheel;
    const loseImageSrc = settings.spinImages.lose;
    const noPrizesLeft = settings.spinPrizes.every((p) => !p.isActive || p.amount <= 0);

    // Automatically open the modal if there are no prizes left (like shuffle game)
    useEffect(() => {
        if (noPrizesLeft) {
            setIsModalOpen(true);
            setPrize(null);
        }
    }, [noPrizesLeft]);

  return (
        <div className="game flex items-center justify-center min-h-screen bg-[#1E293B]">
            <div className="absolute top-4 left-4 z-20">
                <a href="/">
                    <button className="group relative rounded-2xl p-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={spining}>
                        <div className="absolute inset-0 bg-white rounded-2xl shadow-md group-hover:shadow-lg transition-shadow" />
                        <div className="relative flex items-center space-x-2">
                            <img
                                src={exit}
                                alt="Exit Game"
                                className="w-6 h-6 sm:w-8 sm:h-6"
                            />
                        </div>
                    </button>
                </a>
            </div>
            <div className="overflow-clip relative flex items-center justify-center w-full h-full">
                {/* Debug messages for wheel image */}
                {!wheelImageSrc && (
                  <div className="text-red-500">No wheel image found in settings!</div>
                )}
                {wheelImageSrc && !wheelImageSrc.startsWith('data:image') && (
                  <div className="text-red-500">Wheel image is not a valid base64 data URL! Value: {wheelImageSrc.slice(0, 30)}...</div>
                )}
                <div className="relative w-[95vw] max-w-[650px] aspect-square flex items-center justify-center mx-auto">
                  <img className="marker absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-14 h-14" src="/marker.png" alt="Marker" />
                  <img
                    style={{
                        transition: spining ? 'all 7s ease-out' : 'none',
                        transform: spining
                            ? `rotate(${degree}deg)`
                            : `rotate(${degree % 360}deg)`,
                    }}
                    className={`wheel ${spining ? 'blur' : ''} cursor-pointer w-full h-full mt-6 object-contain`}
                    onTransitionEnd={handleSpinEnd}
                    src={wheelImageSrc}
                    onClick={() => onSpinClicked()}
                    alt="Wheel"
                  />
                </div>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        hasWonPrize={hasWonPrize}
                        prize={prize ? (prize.name || prize.id).toLowerCase() : null}
                        loseImageSrc={loseImageSrc}
                        prizeImages={prizeImages}
                        texts={settings.texts}
                        noPrizesLeft={noPrizesLeft}
                        gameType="spin"
                    />
                )}
            </div>
        </div>
  );
}
