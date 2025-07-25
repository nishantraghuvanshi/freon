export default function LoadingSpinner({ message = "Loading..." }) {
  const spinnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center'
  };

  const dotStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    margin: '0 4px',
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out both'
  };

  return (
    <div style={spinnerStyle}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ ...dotStyle, animationDelay: '-0.32s' }}></div>
        <div style={{ ...dotStyle, animationDelay: '-0.16s' }}></div>
        <div style={dotStyle}></div>
      </div>
      <p style={{ color: '#6c757d', margin: 0 }}>{message}</p>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}
