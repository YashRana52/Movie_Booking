const isoTimeFormat = (dateTime) => {
  const date = new Date(dateTime); // string ko Date object me convert karta hai
  const localTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',   // 2 digit hour (e.g., 04)
    minute: '2-digit', // 2 digit minute (e.g., 15)
    hour12: true,      // 12-hour format with AM/PM
  });
  return localTime;
}

export default isoTimeFormat;
