export function formatArrivalTime(seconds) {
  if (seconds <= 60) {
    return "Due";
  }

  const minutes = Math.ceil(seconds / 60);

  return `${minutes} min`;
}