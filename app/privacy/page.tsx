export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px', color: '#1E293B' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Privacy Policy</h1>
      <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Last updated: July 2026</p>

      <div style={{ marginTop: '32px', fontSize: '14px', lineHeight: '1.7' }}>
        <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>What We Do</h2>
        <p>VerifyAI (&ldquo;VerifyAI,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) provides identity verification technology that businesses use during customer support calls. We confirm that a caller controls the phone number on file for their account. We do not store or warehouse sensitive personal information beyond what is required to perform that confirmation.</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Information We Collect</h2>
        <p>When you tap a verification link, we may process a device biometric assertion (Face ID / Touch ID via WebAuthn) and, if needed, a PIN you enter on your own phone. We still do not collect Social Security numbers, account numbers, or other sensitive account details, and we do not ask you to speak those on the call.</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Text Messages</h2>
        <p>If you receive a one-time verification link by text message, that number is used solely to deliver that message and confirm your identity for that call. We do not use your number for marketing and do not sell it to third parties. Reply STOP to any message to opt out.</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Service Providers</h2>
        <p>We rely on the following US-based service providers to operate VerifyAI: Twilio (messaging), Vapi (voice agent infrastructure), Supabase (database), Vercel (hosting), and Anthropic (AI processing).</p>

        <h2 style={{ fontWeight: '600', margin: '24px 0 8px' }}>Contact Us</h2>
        <p>Questions can be sent to <a href="mailto:contact@verifyai.llc" style={{ color: '#2563EB' }}>contact@verifyai.llc</a>.</p>
      </div>
    </main>
  );
}
