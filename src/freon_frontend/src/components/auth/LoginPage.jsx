import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    textAlign: 'center',
    padding: '2rem'
  };

  const logoStyle = {
    width: '120px',
    height: '120px',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '1rem'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '3rem',
    maxWidth: '500px'
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
  };

  return (
    <div style={containerStyle}>
      <img src="/logo2.svg" alt="Freon Logo" style={logoStyle} />
      
      <h1 style={titleStyle}>Welcome to Freon</h1>
      
      <p style={subtitleStyle}>
        A fully on-chain social network built on the Internet Computer. 
        Connect with others, share your thoughts, and be part of the decentralized future.
      </p>
      
      <button 
        onClick={login}
        style={buttonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        Login with Internet Identity
      </button>
    </div>
  );
}
