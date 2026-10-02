/**
 * Safely converts a MongoDB timestamp or date string into a relative time format (e.g., "5m ago").
 * 
 * @param {string | number | Date} dateInput - The timestamp to format
 * @returns {string} Formatted relative time or a safe fallback
 */
export function formatTimeAgo(dateInput) {
  if (!dateInput) return "Just now";

  try {
    const date = new Date(dateInput);
    
    // Check if the resulting Date object is invalid
    if (isNaN(date.getTime())) {
      console.warn("formatTimeAgo received an invalid date string:", dateInput);
      return "Recently";
    }

    const now = new Date();
    const elapsedSeconds = Math.floor((now - date) / 1000);

    // Handle future dates or slight clock skews gracefully
    if (elapsedSeconds < 0) return "Just now";
    if (elapsedSeconds < 60) return "Just now";
    
    const minutes = Math.floor(elapsedSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
    
  } catch (error) {
    console.error("Error formatting date in formatTimeAgo:", error);
    return "Recently"; // Safe fallback so the UI never crashes
  }
}