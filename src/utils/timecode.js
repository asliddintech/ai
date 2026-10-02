/**
 * Utility functions for timecode formatting and calculations
 */

export function formatSecondsToTimecode(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function parseTimecodeToSeconds(timecode) {
  if (!timecode) return 0;
  const parts = timecode.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(timecode) || 0;
}

export function calculateSceneRanges(scenes = [], totalDurationSeconds = 30) {
  if (!scenes.length) return [];
  const durationPerScene = Math.max(1, Math.floor(totalDurationSeconds / scenes.length));
  
  return scenes.map((scene, index) => {
    const startSec = index * durationPerScene;
    const endSec = index === scenes.length - 1 ? totalDurationSeconds : (index + 1) * durationPerScene;
    return {
      ...scene,
      startTime: formatSecondsToTimecode(startSec),
      endTime: formatSecondsToTimecode(endSec),
      durationSec: endSec - startSec
    };
  });
}
