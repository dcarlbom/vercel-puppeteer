'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTitle = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch('/api/fetch-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTitle(data.title);
    } catch (err) {
      setError(err.message || 'Error fetching title');
      setTitle('');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={fetchTitle}
              disabled={loading || !url}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Loading...' : 'Go'}
            </button>
            
            {error && (
              <div className="mt-4 text-red-500 text-center">
                {error}
              </div>
            )}
            
            {title && (
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold">Page Title:</h2>
                <p className="mt-2">{title}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
