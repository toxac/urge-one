
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    // Return empty string for any parsing errors
    return '';
  }
};

// Format date with time - returns empty string for null/undefined/invalid dates
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    // Return empty string for any parsing errors
    return '';
  }
};

// Optional: More specific date formatters with additional safety

// Format date with custom fallback
export const formatDateWithFallback = (
  dateString: string | null | undefined, 
  fallback: string = ''
): string => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? fallback : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return fallback;
  }
};

// Format date time with custom fallback
export const formatDateTimeWithFallback = (
  dateString: string | null | undefined, 
  fallback: string = ''
): string => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? fallback : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return fallback;
  }
};

// Short date format
export const formatShortDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return '';
  }
};

// Relative time format (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  } catch (error) {
    return '';
  }
};