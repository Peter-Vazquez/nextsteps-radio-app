import React, { useRef, useEffect, useState } from 'react';

export default function App() {
  const [nowPlaying, setNowPlaying] = useState('Loading...');
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setNowPlaying('Live Talk with Peter Vazquez'), 1000);

    if (autoplayEnabled && audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.warn('Autoplay blocked by browser:', e);
      });
    }
  }, [autoplayEnabled]);

  const toggleAutoplay = () => setAutoplayEnabled(prev => !prev);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '1rem', backgroundColor: 'white', color: '#1a202c' }}>
      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '1.5rem', borderRadius: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Next Steps Radio Podcast Network</h1>
        <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Voice of Liberty. Defender of Truth.</p>
      </header>

      <section style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>🎧 Live Stream</h2>
          <audio ref={audioRef} controls src="https://s9.citrus3.com:8272/stream" style={{ width: '100%' }} />
          <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>Now Playing: {nowPlaying}</p>
          <button onClick={toggleAutoplay} style={{ marginTop: '0.5rem' }}>
            Autoplay: {autoplayEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>📅 Show Schedule</h2>
          <ul style={{ paddingLeft: '1.25rem', color: '#4a5568' }}>
            <li>Mon–Fri @ 12 PM ET: The Next Steps Show (Live)</li>
            <li>Saturdays: Weekend Rewind</li>
            <li>Specials: Air as Announced</li>
          </ul>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>🙏 Bible Verse of the Day</h2>
          <p style={{ fontStyle: 'italic', color: '#4a5568' }}>"If the foundations be destroyed, what can the righteous do?" — Psalm 11:3</p>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>🎙️ Host Bio</h2>
          <p style={{ color: '#4a5568' }}>Peter Vazquez — Disabled veteran, servant leader, and fierce advocate for liberty, faith, and family. Host of The Next Steps Show.</p>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>💬 Leave a Comment</h2>
          <input placeholder="Type your comment..." style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }} />
          <button style={{ marginTop: '0.5rem' }}>Submit</button>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#b91c1c', color: 'white', padding: '0.75rem', borderRadius: '0.5rem' }}>
            💵 Support the Mission
          </button>
        </div>
      </section>

      <footer style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#718096', textAlign: 'center' }}>
        <p>Contact: peter@nextstepsshow.com | (585) 880-7580</p>
        <p style={{ marginTop: '0.25rem' }}>&copy; 2025 Next Steps Radio Podcast Network</p>
      </footer>
    </main>
  );
}