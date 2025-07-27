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
        <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Voice of Freedom. Defender of Truth.</p>
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
  <p style={{ color: '#4a5568' }}>
    Unlock the wisdom of tomorrow with the <strong>Next Steps Show</strong>! Dive into all episodes anytime on our app, or join the live excitement every day at noon on these powerhouse stations:
  </p>
  <p style={{ color: '#4a5568', marginTop: '0.75rem', fontWeight: 'bold' }}>
    WYSL 92.1 FM | 95.5 FM | 1040 AM<br />
    WLEA 1480 AM | 106.9 FM | 92.1 FM
  </p>
  <p style={{ color: '#4a5568', marginTop: '0.75rem' }}>
    —one inspiring broadcast at a time!
  </p>
</div>


        <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>🙏 Bible Verse of the Day</h2>
          <p style={{ fontStyle: 'italic', color: '#4a5568' }}>"If the foundations be destroyed, what can the righteous do?" — Psalm 11:3</p>
        </div>

       <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>🎙️ Host Bio</h2>
  <p style={{ color: '#4a5568', fontWeight: 'bold' }}>
    Host & Producer, Next Steps Show | Owner, Next Steps Radio Podcast Network
  </p>
  <p style={{ color: '#4a5568', marginTop: '0.75rem' }}>
    Peter Vazquez is a military veteran, servant leader, business owner, and advocate born and raised in Rochester, NY. His extensive experience in community-centered service, coupled with his decisive leadership in both business and grassroots not-for-profit initiatives, forms a robust foundation. This background fuels his motivation to oppose the persistent political decisions that perpetuate segregation.
  </p>
  <p style={{ color: '#4a5568', marginTop: '0.75rem' }}>
    Peter, a devoted husband and father of five, also shouldered the responsibility of caring for his elderly parents. He recognizes his calling after years of collaborating with community leaders and organizers in search of a consistent, just, and unwavering voice. Committed to fostering unity, Peter emphasizes the importance of acknowledging both similarities and differences rooted in community perspectives. He champions a "listen first" approach and is a staunch believer in prioritizing life, education, and entrepreneurship as avenues for growth, celebration, and prosperity for everyone in the community.
  </p>
  <p style={{ color: '#4a5568', marginTop: '0.75rem' }}>
    With his charismatic and genuine demeanor, Peter introduces a fresh perspective, fostering collaboration where discord has been prevalent. As one individual notes, Peter is the ideal ally for those aiming to build a New York centered on opportunity and growth, rather than dependency and self-interest. Grounded in the sanctity of human life, the promotion of free-market principles, and the advocacy for limited government, Peter stands as a beacon for those who value liberty, demand integrity amidst corruption, and champion moral righteousness. His unwavering resolve is complemented by his dedication to showcasing a servant's heart, marking him as a truly commendable and inspirational figure.
  </p>
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
