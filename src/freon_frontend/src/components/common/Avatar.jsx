export default function Avatar({ 
  src, 
  alt = 'Avatar', 
  size = 40, 
  username = '', 
  showPlaceholder = true 
}) {
  // Generate placeholder avatar based on username
  function generatePlaceholderAvatar(username) {
    if (!username) return '/logo2.svg';
    
    // Generate a color based on username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    
    const color = colors[Math.abs(hash) % colors.length];
    const initials = username.slice(0, 2).toUpperCase();
    
    // Create SVG placeholder
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
        <text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">
          ${initials}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    display: 'inline-block'
  };

  // Determine what image to show
  let imageSrc = src;
  if (!imageSrc && showPlaceholder) {
    imageSrc = generatePlaceholderAvatar(username);
  }
  if (!imageSrc) {
    imageSrc = '/logo2.svg';
  }

  return (
    <img 
      src={imageSrc}
      alt={alt}
      style={avatarStyle}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        if (showPlaceholder && username) {
          e.target.src = generatePlaceholderAvatar(username);
        } else {
          e.target.src = '/logo2.svg';
        }
      }}
    />
  );
}
