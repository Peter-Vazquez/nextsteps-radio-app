import React, { useRef, useState } from 'react';
import './App.css';

const STREAM_URL = 'https://s9.citrus3.com:8272/stream';

const stations = [
  'WYSL 92.1 FM | 95.5 FM | 1040 AM',
  'WLEA 1480 AM | 106.9 FM | 92.1 FM'
];

function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const audioRef = useRef(null);
  const [streamStatus, setStreamStatus] = useState('Ready when you are.');

  const handlePlay = async () => {
    try {
      await audioRef.current?.play();
      setStreamStatus('Live stream is playing.');
    } catch (error) {
      setStreamStatus('Press play on the audio bar to start the stream.');
      console.warn('Audio playback blocked:', error);
    }
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Voice of Freedom. Defender of Truth.</p>
        <h1>Next Steps Radio Podcast Network</h1>
        <p className="hero-copy">
          Live radio, podcast conversations, and practical commentary rooted in faith,
          liberty, family, and community leadership.
        </p>
      </header>

      <div className="content-grid">
        <Card title="Live Stream">
          <audio ref={audioRef} controls src={STREAM_URL} className="audio-player">
            Your browser does not support the audio element.
          </audio>
          <div className="stream-actions">
            <button type="button" onClick={handlePlay}>Start Live Stream</button>
            <span>{streamStatus}</span>
          </div>
        </Card>

        <Card title="Show Schedule">
          <p>Listen live daily at noon Eastern, or catch episodes anytime through the app.</p>
          <ul className="station-list">
            {stations.map((station) => (
              <li key={station}>{station}</li>
            ))}
          </ul>
        </Card>

        <Card title="Verse of the Day">
          <blockquote>
            "If the foundations are destroyed, what can the righteous do?"
            <cite>Psalm 11:3</cite>
          </blockquote>
        </Card>

        <Card title="Host Bio">
          <p className="role-line">
            Host and Producer, Next Steps Show | Owner, Next Steps Radio Podcast Network
          </p>
          <p>
            Peter Vazquez is a military veteran, servant leader, business owner, and advocate
            born and raised in Rochester, New York.
          </p>
          <p>
            The show brings together faith, family, civic life, entrepreneurship, and honest
            conversation for listeners who still believe truth matters.
          </p>
        </Card>

        <Card title="Contact the Show">
          <p>Have a topic, guest idea, sponsor inquiry, or community story worth sharing?</p>
          <div className="link-row">
            <a href="mailto:peter@nextstepsshow.com">Email Peter</a>
            <a href="tel:+15858807580">Call the Show</a>
          </div>
        </Card>

        <Card title="Support the Mission">
          <p>Help keep independent, community-centered conversation strong.</p>
          <button type="button" className="support-button">Donation Link Coming Soon</button>
        </Card>
      </div>

      <footer className="site-footer">
        <p>Contact: peter@nextstepsshow.com | (585) 880-7580</p>
        <p>&copy; 2026 Next Steps Radio Podcast Network</p>
      </footer>
    </main>
  );
}
