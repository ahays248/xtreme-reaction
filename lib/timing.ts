export function calculateReactionTime(startTime: number, endTime: number): number {
  const rawTime = Math.round(endTime - startTime)
  // Minimum human reaction time is around 100ms
  // Anything less is likely a keyboard shortcut or cheating
  return Math.max(100, rawTime)
}

export function calculateAverage(times: number[]): number {
  if (times.length === 0) return 0
  const sum = times.reduce((acc, time) => acc + time, 0)
  return Math.round(sum / times.length)
}

export function formatTime(ms: number): string {
  return `${ms}ms`
}

export function getLastNTimes(times: number[], n: number): number[] {
  return times.slice(-n)
}