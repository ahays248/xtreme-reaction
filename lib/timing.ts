export function calculateReactionTime(startTime: number, endTime: number): number {
  return Math.round(endTime - startTime)
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