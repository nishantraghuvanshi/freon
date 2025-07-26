import { useState } from 'react';
import { FiSend, FiUser, FiZap, FiX } from 'react-icons/fi';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../styles/theme';

export default function CyclesTransfer({ isOpen, onClose, onSuccess }) {
  const { principal } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');

    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const recipientPrincipal = Principal.fromText(recipient);
      const transferAmount = Number(amount);

      const result = await freon_backend.transfer_cycles(
        Principal.fromText(principal.toText()),
        recipientPrincipal,
        transferAmount
      );

      if (result.success) {
        onSuccess?.(transferAmount, recipient);
        setRecipient('');
        setAmount('');
        onClose();
      } else {
        setError(result.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setError('Invalid recipient ID or transfer failed');
    }
    setLoading(false);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: '2rem',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: theme.borderRadius.md,
    color: theme.colors.neutral[500]
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700]
  };

  const inputStyle = {
    padding: '0.75rem',
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: theme.colors.secondary.main,
    color: 'white',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };

  const errorStyle = {
    color: theme.colors.error.main,
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: theme.colors.error[50],
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.error[200]}`
  };

  const infoBoxStyle = {
    padding: '0.75rem',
    backgroundColor: theme.colors.secondary[50],
    border: `1px solid ${theme.colors.secondary[200]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '0.8rem',
    color: theme.colors.secondary[700],
    marginBottom: '1rem'
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={titleStyle}>
            <FiSend size={20} color={theme.colors.secondary.main} />
            Transfer Cycles
          </div>
          <button style={closeButtonStyle} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div style={infoBoxStyle}>
          <FiZap size={14} style={{display: 'inline', marginRight: '0.5rem'}} />
          Send cycles to other users to support their content or share rewards.
        </div>

        <form style={formStyle} onSubmit={handleTransfer}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiUser size={14} style={{display: 'inline', marginRight: '0.25rem'}} />
              Recipient Principal ID
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter principal ID..."
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FiZap size={14} style={{display: 'inline', marginRight: '0.25rem'}} />
              Amount (Cycles)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              min="1"
              style={inputStyle}
              required
            />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? (
              'Transferring...'
            ) : (
              <>
                <FiSend size={16} />
                Transfer Cycles
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
