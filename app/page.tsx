export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0B1220', color: '#E5EAF3', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px' }}>

        <p style={{ fontSize: '14px', fontWeight: 600, color: '#4F7DF3', letterSpacing: '1px' }}>VERIFYAI</p>

        <h1 style={{ fontSize: '38px', fontWeight: 'bold', lineHeight: 1.2, marginTop: '16px' }}>
          Silent identity verification for customer support calls
        </h1>

        <p style={{ fontSize: '17px', color: '#9AA6BC', marginTop: '20px', lineHeight: 1.7 }}>
          VerifyAI lets support teams confirm a caller&apos;s identity in seconds — without asking
          them to read sensitive information out loud. The rep sends a secure one-time link by text,
          the caller taps it on their phone, and the verification completes silently. Nothing
          sensitive is ever spoken on the call.
        </p>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>How it works</h2>
          <ol style={{ marginTop: '12px', paddingLeft: '20px', color: '#9AA6BC', lineHeight: 2 }}>
            <li>Caller verbally agrees to receive a one-time verification text.</li>
            <li>VerifyAI sends a secure link to the phone number on file.</li>
            <li>The caller taps the link and confirms on a secure webpage.</li>
            <li>The rep&apos;s dashboard unlocks — no codes read aloud, ever.</li>
          </ol>
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Built for financial institutions</h2>
          <p style={{ color: '#9AA6BC', marginTop: '12px', lineHeight: 1.7 }}>
            VerifyAI is designed for credit unions and community banks that want to protect members
            from social engineering — deployable in days, with transparent monthly pricing and no
            contact-center integration project required.
          </p>
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Contact</h2>
          <p style={{ color: '#9AA6BC', marginTop: '12px' }}>
            Questions or pilot inquiries:{' '}
            <a href="mailto:contact@verifyai.llc" style={{ color: '#4F7DF3' }}>contact@verifyai.llc</a>
          </p>
        </div>

        <footer style={{ marginTop: '80px', paddingTop: '24px', borderTop: '1px solid #1E2A44', fontSize: '14px', color: '#9AA6BC' }}>
          <a href="/privacy" style={{ color: '#9AA6BC', marginRight: '20px' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#9AA6BC' }}>Terms of Service</a>
          <p style={{ marginTop: '12px' }}>&copy; 2026 VerifyAI &middot; Plainfield, Indiana</p>
        </footer>

      </div>
    </main>
  );
}
