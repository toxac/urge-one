
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


export const getTimeDifference = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    
    // Check if the date is valid
    if (isNaN(givenDate.getTime())) {
      return '';
    }
    
    const diffInMs = currentDate.getTime() - givenDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    // Return in the most appropriate unit
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    return '';
  }
};


export const getTimeDifferenceFuture = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    
    if (isNaN(givenDate.getTime())) {
      return '';
    }
    
    const diffInMs = givenDate.getTime() - currentDate.getTime();
    const isFuture = diffInMs > 0;
    const absDiffInMs = Math.abs(diffInMs);
    
    const diffInSeconds = Math.floor(absDiffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    const tense = isFuture ? 'from now' : 'ago';
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ${tense}`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ${tense}`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ${tense}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ${tense}`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ${tense}`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ${tense}`;
    } else {
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ${tense}`;
    }
  } catch (error) {
    return '';
  }
};