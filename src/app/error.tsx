'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Erreur serveur</h2>
          <p className="text-gray-500 mb-8">Une erreur inattendue s&apos;est produite.</p>
          <button
            onClick={reset}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );
} 