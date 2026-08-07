import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('Next Steps Radio web app', () => {
  it('renders core production content', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Next Steps Radio Podcast Network' })).toBeInTheDocument();
    expect(screen.getByText('WYSL 92.1 FM | 95.5 FM | 1040 AM')).toBeInTheDocument();
    expect(screen.getByText('WLEA 1480 AM | 106.9 FM | 92.1 FM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Donation Link Coming Soon' })).toBeInTheDocument();
  });

  it('keeps the live stream pointed at Citrus3', () => {
    const { container } = render(<App />);
    const audio = container.querySelector('audio');

    expect(audio).toHaveAttribute('src', 'https://s9.citrus3.com:8272/stream');
  });

  it('updates the stream status after playback starts', async () => {
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Start Live Stream' }));

    expect(await screen.findByText('Live stream is playing.')).toBeInTheDocument();
    playSpy.mockRestore();
  });
});
