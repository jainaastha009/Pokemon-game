import { useState } from 'react';

const PokemonModal = ({ isOpen, onRequestClose, pokemon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {pokemon && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">{pokemon.name}</h2>
            <img 
              src={pokemon.sprites.front_default} 
              alt={pokemon.name} 
              className="w-32 h-32 mx-auto mb-4"
            />
            {/* <p className="text-center mb-4">
              <strong>Moves:</strong> {pokemon.moves.map(move => move.move.name).join(', ')}
            </p> */}
            <button 
              onClick={onRequestClose} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonModal;
