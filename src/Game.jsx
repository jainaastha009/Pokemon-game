import { useState, useEffect } from 'react';
import PokemonModal from './PokemonModel';

function Game() {
  const [data, setData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [gameStatus, setGameStatus] = useState('playing');
  const [hint, setHint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`);
        const data = await response.json();
        const detailedPromises = data.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          return pokemonResponse.json();
        });

        const detailedData = await Promise.all(detailedPromises);
        setData(detailedData);
        console.log(data);
        

        // Select a random Pokémon
        if (detailedData.length > 0) {
          const randomIndex = Math.floor(Math.random() * detailedData.length);
          
          setSelectedPokemon(detailedData[randomIndex]);
          console.log(selectedPokemon.name);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleGuess = () => {
    if (currentGuess.trim() === '') {
      setHint('Please enter a guess!');
      return;
    }

    setAttempts(attempts + 1);
    console.log(selectedPokemon.name);
    
    if (currentGuess.toLowerCase() === selectedPokemon.name.toLowerCase()) {
      setGameStatus('won');
      openModal(); // Open modal when guessed correctly
    } else if (attempts + 1 >= maxAttempts) {
      setGameStatus('lost');
      openModal(); // Open modal when game is lost
    } else {
      setHint(`Hint: The Pokémon's type includes ${selectedPokemon.types.map(type => type.type.name).join(', ')}`);
      setCurrentGuess('');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      {gameStatus === 'playing' && (
        <>
          <h1 className="mb-4 text-2xl font-bold text-center">Guess the Pokemon</h1>
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            placeholder="Enter your guess"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={handleGuess}
            className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Submit Guess
          </button>
          {hint && <p className="mb-4 text-center">{hint}</p>}
          <p className="text-center">Attempts: {attempts}/{maxAttempts}</p>
        </>
      )}
      {gameStatus === 'won' && (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Congratulations! You guessed the Pokémon!</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Game Over! The Pokémon was {selectedPokemon.name}.</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Play Again
          </button>
        </div>
      )}
      <PokemonModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        pokemon={selectedPokemon}
      />
    </div>
  );
}

export default Game;
