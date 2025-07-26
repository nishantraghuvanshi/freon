import { useState, useEffect } from 'react';
import { FiZap, FiTrendingUp, FiInfo } from 'react-icons/fi';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../styles/theme';

export default function CyclesDisplay({ showDetails = false }) {
  const { principal } = useAuth();
  const [cyclesBalance, setCyclesBalance] = useState(0);
  const [canisterCycles, setCanisterCycles] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (principal) {
      fetchCyclesData();
    }
  }, [principal]);

  async function fetchCyclesData() {
    setLoading(true);
    try {
      const principalObj = Principal.fromText(principal.toText());
      const [userBalance, canisterBalance] = await Promise.all([
        freon_backend.get_cycles_balance(principalObj),
        freon_backend.get_canister_cycles()
      ]);
      setCyclesBalance(Number(userBalance));
      setCanisterCycles(Number(canisterBalance));
    } catch (error) {
      console.error('Failed to fetch cycles data:', error);
    }
    setLoading(false);
  }

  const formatCycles = (cycles) => {
    if (cycles >= 1e12) return `${(cycles / 1e12).toFixed(1)}T`;
    if (cycles >= 1e9) return `${(cycles / 1e9).toFixed(1)}B`;
    if (cycles >= 1e6) return `${(cycles / 1e6).toFixed(1)}M`;
    if (cycles >= 1e3) return `${(cycles / 1e3).toFixed(1)}K`;
    return cycles.toString();
  };

  const cyclesDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    border: `1px solid ${theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.secondary[700],
    minWidth: 'fit-content'
  };

  const detailsStyle = {
    marginTop: '0.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    fontSize: '0.8rem'
  };

  const statRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: `1px solid ${theme.colors.neutral[100]}`
  };

  const infoBoxStyle = {
    marginTop: '0.5rem',
    padding: '0.75rem',
    backgroundColor: theme.colors.secondary[50],
    borderRadius: theme.borderRadius.md,
    fontSize: '0.75rem',
    color: theme.colors.secondary[700],
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem'
  };

  if (loading) {
    return (
      <div style={cyclesDisplayStyle}>
        <FiZap size={16} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={cyclesDisplayStyle}>
        <FiZap size={16} color={theme.colors.secondary[500]} />
        <span>{formatCycles(cyclesBalance)} Cycles</span>
      </div>

      {showDetails && (
        <div style={detailsStyle}>
          <div style={statRowStyle}>
            <span>Your Balance:</span>
            <strong>{cyclesBalance.toLocaleString()} cycles</strong>
          </div>
          
          <div style={statRowStyle}>
            <span>Canister Balance:</span>
            <strong>{formatCycles(canisterCycles)} cycles</strong>
          </div>

          <div style={{...statRowStyle, borderBottom: 'none'}}>
            <span>Network Status:</span>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.colors.success.main
              }} />
              <span style={{color: theme.colors.success.main, fontSize: '0.75rem'}}>
                Active
              </span>
            </div>
          </div>

          <div style={infoBoxStyle}>
            <FiInfo size={14} style={{marginTop: '1px', flexShrink: 0}} />
            <div>
              <div style={{fontWeight: theme.typography.fontWeight.medium, marginBottom: '0.25rem'}}>
                Earn Cycles:
              </div>
              <div>• 10 cycles for creating posts</div>
              <div>• 5 cycles when your posts get liked</div>
              <div>• 2 cycles for commenting</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
