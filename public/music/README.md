# Background Music

This directory contains the background music tracks for different game states.

## Files Required:
- `gameplay.mp3` - Plays during active gameplay (looped)
- `results.mp3` - Plays on the game over/results screen (looped)

## Music Specifications:
- Format: MP3
- Bitrate: 128-192 kbps (for web optimization)
- Duration: 60-120 seconds (will loop seamlessly)
- Volume: Normalized to prevent clipping
- Loop Point: Must loop smoothly without gaps

## AI Music Generation Prompts:

### Gameplay Music (gameplay.mp3)
**For ElevenLabs/Suno AI:**
```
Create a high-energy cyberpunk arcade track. 120-140 BPM. Matrix-inspired electronic music with pulsing bass, digital arpeggios, and glitchy percussion. Should maintain tension without being overwhelming. Include subtle build-ups and electronic sweeps. Loop seamlessly. Think retro arcade meets The Matrix - neon green digital sounds, synthetic drums, and futuristic atmosphere. Duration: 90-120 seconds, perfect loop point.
```

### Results Music (results.mp3)
**For ElevenLabs/Suno AI:**
```
Create a cyberpunk victory/results screen music. 90-100 BPM. Atmospheric and reflective but still electronic. Blend accomplishment with anticipation for the next round. Use ambient pads, soft arpeggios, and gentle percussion. Include Matrix-style digital rain sounds in background. Should feel like a brief respite between intense sessions. Smooth loop. Duration: 60-90 seconds.
```

## Implementation Notes:
- Music automatically plays based on game state
- Separate volume control from sound effects
- Music can be muted independently
- Loops seamlessly during gameplay
- Switches tracks when transitioning to results screen

## Legacy File:
- `background.mp3` - Original placeholder (no longer used)