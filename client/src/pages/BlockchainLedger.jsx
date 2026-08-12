import React, { useState } from 'react';
import { ShieldCheck, Lock, ExternalLink, Search, CheckCircle, AlertTriangle } from 'lucide-react';

export default function BlockchainLedger({ ledgerRecords, onVerifyHash }) {
  const [searchTxHash, setSearchTxHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchTxHash.trim()) return;
    const res = await onVerifyHash(searchTxHash.trim());
    setVerificationResult(res);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Blockchain Integration Ledger</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Immutable proof ledger for milestone completions & tamper-evident goal achievements.
        </p>
      </div>

      {/* On-Chain Hash Verifier Widget */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={20} color="var(--accent-purple)" /> Cryptographic Proof Verifier
        </h3>

        <form onSubmit={handleVerify} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Paste TxHash (e.g. 0x7a8f...)"
            value={searchTxHash}
            onChange={(e) => setSearchTxHash(e.target.value)}
            style={{ fontFamily: 'monospace' }}
            id="txhash-verify-input"
          />
          <button type="submit" className="btn-primary" id="verify-hash-btn">
            <ShieldCheck size={18} /> Verify On-Chain
          </button>
        </form>

        {verificationResult && (
          <div style={{
            padding: '14px',
            borderRadius: '10px',
            background: verificationResult.valid ? 'rgba(5, 150, 105, 0.08)' : 'rgba(225, 29, 72, 0.08)',
            border: verificationResult.valid ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(225, 29, 72, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: verificationResult.valid ? 'var(--accent-emerald)' : 'var(--accent-rose)'
          }}>
            {verificationResult.valid ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{verificationResult.message}</div>
              {verificationResult.record && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'monospace' }}>
                  Block #{verificationResult.record.blockNumber} | SHA-256 Payload Hash: {verificationResult.record.dataHash.substring(0, 16)}...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Immutable Audit Ledger Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={20} color="var(--accent-cyan)" /> Tenant Immutable Milestone Audit Log
        </h3>

        {ledgerRecords && ledgerRecords.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--bg-card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                  <th style={{ padding: '12px' }}>Record Type</th>
                  <th style={{ padding: '12px' }}>TxHash</th>
                  <th style={{ padding: '12px' }}>Block #</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {ledgerRecords.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-purple">{r.recordType}</span>
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                      {r.txHash.substring(0, 14)}...
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-primary)' }}>#{r.blockNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-emerald">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '20px 0' }}>
            No milestone records committed on-chain yet. Complete a milestone in Goal & Roadmap tab to trigger automatic blockchain logging!
          </div>
        )}
      </div>
    </div>
  );
}
