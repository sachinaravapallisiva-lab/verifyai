export default function TermsPage() {
  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px', color: '#1E293B' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Terms of Service</h1>
      <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Last updated: August 2026</p>

      <div style={{ marginTop: '32px', fontSize: '14px', lineHeight: '1.7' }}>
        <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>The Service</h2>
        <p>
          VerifyAI provides identity verification technology to businesses for use during customer support calls.
          These terms govern use of our website and verification service.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>What this check is</h2>
        <p>
          Your device Face ID or fingerprint is used only to confirm it is you for this one verification.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Why we ask</h2>
        <p>
          The check is an identity check for the support call. The result is not used for ads. It is not sold.
          It is not used for ranking.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>How it works</h2>
        <p>
          The Face ID or fingerprint check runs on your device. We do not receive a face map or fingerprint file.
          Caller Face ID or Touch ID is a device WebAuthn check. We store a device passkey public credential
          (credential id, public key, counter, device type, backup flag, transports, and last used time).
          We also store a pass or fail result, the time, and a session status such as verified or awaiting a
          second step, with a biometric method tag when that path is used. We may store a PIN hash if you use a PIN.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Your written yes</h2>
        <p>
          You must agree to these terms before the check runs. If you leave the box unchecked or refuse, no
          biometric check runs.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>How long we keep it</h2>
        <p>
          We store only the passkey credential and the pass or fail result while the institution needs the
          verification record. We delete them on request. We do not set a fixed number of years for retention.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Age</h2>
        <p>You must be 18 or older. This service is not for children.</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Who gets the result</h2>
        <p>
          The result goes to the institution that sent you the link, for that support call, on the rep dashboard.
          It is not shown on the public site.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>You can refuse</h2>
        <p>You can refuse. If you refuse, the call then does not complete.</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Acceptable Use</h2>
        <p>
          The service may only be used for lawful identity verification purposes. You may not use it to harass,
          defraud, or impersonate another person.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>No Warranty</h2>
        <p>
          The service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied, to the
          fullest extent permitted by law.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, VerifyAI is not liable for indirect, incidental, or
          consequential damages arising from use of the service.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Governing Law</h2>
        <p>These terms are governed by the laws of the State of Indiana.</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Legal review</h2>
        <p>
          A lawyer should review these terms before anyone treats them as a court contract.
        </p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Contact Us</h2>
        <p>
          Questions can be sent to{' '}
          <a href="mailto:contact@verifyai.llc" style={{ color: '#2563EB' }}>contact@verifyai.llc</a>.
        </p>
      </div>
    </main>
  );
}
