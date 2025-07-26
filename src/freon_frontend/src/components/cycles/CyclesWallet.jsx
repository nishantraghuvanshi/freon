import { useState } from 'react';
import { FiZap, FiSend, FiTrendingUp, FiInfo, FiRefreshCw } from 'react-icons/fi';
import CyclesDisplay from './CyclesDisplay';
import CyclesTransfer from './CyclesTransfer';
import { theme } from '../../styles/theme';

export default function CyclesWallet() {
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransferSuccess = (amount, recipient) => {
    console.log(`Transferred ${amount} cycles to ${recipient}`);
    // Refresh the cycles display
    setRefreshKey(prev => prev + 1);
  };

  const walletStyle = {
    backgroundColor: 'white',
    border: `1px solid ${theme.colors.neutral[200]}`,
    borderRadius: theme.borderRadius.lg,
    padding: '1.5rem',
    margin: '1rem 0'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: theme.colors.secondary.main,
    color: 'white',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: theme.typography.fontWeight.medium
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: theme.colors.neutral[600],
    border: `1px solid ${theme.colors.neutral[300]}`
  };

  const toggleButtonStyle = {
    ...secondaryButtonStyle,
    padding: '0.5rem',
    minWidth: 'auto'
  };

  return (
    <div style={walletStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <FiZap size={20} color={theme.colors.secondary.main} />
          Cycles Wallet
        </div>
        
        <div style={actionsStyle}>
          <button
            style={toggleButtonStyle}
            onClick={() => setRefreshKey(prev => prev + 1)}
            title="Refresh balance"
          >
            <FiRefreshCw size={16} />
          </button>
          
          <button
            style={toggleButtonStyle}
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? "Hide details" : "Show details"}
          >
            <FiInfo size={16} />
          </button>

          <button
            style={buttonStyle}
            onClick={() => setShowTransfer(true)}
          >
            <FiSend size={16} />
            Transfer
          </button>
        </div>
      </div>

      <div key={refreshKey}>
        <CyclesDisplay showDetails={showDetails} />
      </div>

      <CyclesTransfer
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
}
