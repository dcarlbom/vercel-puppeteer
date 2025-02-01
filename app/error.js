'use client'

export default function Error({
  error,
  reset,
}) {
  console.error('Error boundary caught:', error);
  
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 