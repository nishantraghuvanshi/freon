import { FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { theme } from '../../styles/theme';

export default function LoginPage() {
  const { login } = useAuth();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: 'clamp(1rem, 4vw, 2rem)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const logoStyle = {
    width: 'clamp(100px, 20vw, 150px)',
    height: 'clamp(100px, 20vw, 150px)',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[900],
    marginBottom: '1rem',
    fontFamily: theme.typography.fontFamily.heading
  };

  const subtitleStyle = {
    fontSize: 'clamp(1rem, 3vw, 1.25rem)',
    color: theme.colors.neutral[600],
    marginBottom: 'clamp(2rem, 5vw, 3rem)',
    maxWidth: '500px',
    lineHeight: theme.typography.lineHeight.relaxed
  };

  const cardStyle = {
    padding: 'clamp(2rem, 5vw, 3rem)',
    maxWidth: '100%',
    width: '100%'
  };

  return (
    <div 
      style={containerStyle}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Card variant="elevated" style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              ...logoStyle,
              background: `linear-gradient(135deg, ${theme.colors.secondary[500]}, ${theme.colors.secondary[600]})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)',
              border: `3px solid ${theme.colors.secondary[400]}`
            }}
          >
            F
          </div>
          
          <h1 
            style={titleStyle}
          >
            Welcome to Freon
          </h1>
          
          <p 
            style={subtitleStyle}
          >
            A fully on-chain social network built on the Internet Computer. 
            Connect with others, share your thoughts, and be part of the decentralized future.
          </p>
          
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Button
              variant="primary"
              size="large"
              onClick={login}
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                gap: '0.75rem',
                minWidth: '200px',
                background: theme.colors.primary[700], 
                color: theme.colors.neutral[0],
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiLogIn size={20} />
              Login with Internet Identity
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
