'use client';

import { useState } from 'react';

export default function Home() {
  const [topik, setTopik] = useState('');
  const [ide, setIde] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function buatIde() {
    if (!topik.trim()) {
      setError('Isi dulu topiknya ya.');
      return;
    }
    setLoading(true);
    setError('');
    setIde('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topik }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memanggil AI.');
      }

      setIde(data.ide);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 32, color: '#e67e22' }}>Content Brainstormer</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Ketik topik, biar AI kasih ide konten buat tim kamu.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={topik}
          onChange={(e) => setTopik(e.target.value)}
          placeholder="Contoh: tips produktivitas kerja"
          style={{ flex: 1, padding: 12, fontSize: 16, border: '2px solid #f0c27b', borderRadius: 8 }}
        />
        <button
          onClick={buatIde}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: 16,
            background: loading ? '#ccc' : '#e67e22',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Mikir...' : 'Buat Ide'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {ide && (
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '2px solid #f0c27b', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {ide}
        </div>
      )}
    </main>
  );
}