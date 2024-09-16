export function getCurrentTimestamp() {
  const now = new Date();

  // Get year, month, day, hours, minutes, and seconds
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Construct the timestamp string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
