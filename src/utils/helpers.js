export const cleanHtml = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '');
};

export const formatDate = (dateString, formatType = 'full') => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  switch (formatType) {
    case 'short':
      return `${year}.${month}.${day}`;
    case 'locale':
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'full':
    default:
      return `${year}.${month}.${day} ${hours}:${minutes}`;
  }
};

export const truncateText = (text, maxLength) => {
  if (typeof text !== 'string' || text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};