export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-gray-300 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-neon-green font-orbitron">Privacy Policy</h1>
        <p className="mb-6 text-sm text-gray-400">Last updated: December 27, 2024</p>
        
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">1. Introduction</h2>
          <p className="mb-4 leading-relaxed">
            Xtreme Reaction ("we", "our", or "the Game") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our game and associated services. By using Xtreme Reaction, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">2. Information We Collect</h2>
          
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">2.1 Information from X (Twitter)</h3>
          <p className="mb-3">When you authenticate via X OAuth, we collect:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Your X username and display name</li>
            <li>Your X user ID (unique identifier)</li>
            <li>Your public profile information</li>
            <li>Your email address (if you grant permission)</li>
            <li>Profile picture URL (public information)</li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">2.2 Game Data</h3>
          <p className="mb-3">We automatically collect gameplay information including:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Game scores and reaction times</li>
            <li>Accuracy and performance metrics</li>
            <li>Gameplay timestamps and session duration</li>
            <li>Achievement progress</li>
            <li>Device type (mobile/desktop) for fair competition</li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">2.3 Technical Data</h3>
          <p className="mb-3">We collect certain technical information:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Browser type and version</li>
            <li>Device information (screen size, touch capability)</li>
            <li>IP address (for security and region determination)</li>
            <li>Cookies and local storage data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">3. How We Use Your Information</h2>
          <p className="mb-3">We use collected information to:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Authenticate you and maintain your game session</li>
            <li>Display your username on public leaderboards</li>
            <li>Save and track your game progress and high scores</li>
            <li>Enable social features like score sharing to X</li>
            <li>Generate personalized performance statistics</li>
            <li>Prevent cheating and ensure fair play</li>
            <li>Improve game performance and user experience</li>
            <li>Send important game updates (if opted in)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">4. Information Sharing and Disclosure</h2>
          
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">4.1 Public Information</h3>
          <p className="mb-4">
            Your X username and game scores are publicly visible on leaderboards. Other players can see your performance metrics and achievements.
          </p>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">4.2 Third-Party Services</h3>
          <p className="mb-3">We share data with:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>X (Twitter):</strong> For authentication and social sharing features</li>
            <li><strong>Supabase:</strong> Our database and authentication provider</li>
            <li><strong>Vercel:</strong> Our hosting and analytics provider</li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">4.3 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose information if required by law, court order, or other legal process, or if we believe disclosure is necessary to protect our rights or the safety of our users.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">5. Data Storage and Security</h2>
          <p className="mb-4">
            Your data is securely stored in Supabase's encrypted databases. We implement industry-standard security measures including:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Secure authentication tokens</li>
            <li>Row-level security in databases</li>
            <li>Regular security audits</li>
            <li>Limited access to personal data</li>
          </ul>
          <p className="mb-4">
            However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">6. Cookies and Local Storage</h2>
          <p className="mb-4">
            We use cookies and local storage to:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Maintain your authentication session</li>
            <li>Remember your game preferences (sound settings, etc.)</li>
            <li>Store temporary game state</li>
            <li>Track anonymous usage statistics</li>
          </ul>
          <p className="mb-4">
            You can disable cookies in your browser settings, but this may limit game functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">7. Your Rights and Choices</h2>
          
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">7.1 Access and Correction</h3>
          <p className="mb-4">
            You can view and update your profile information at any time through the game interface.
          </p>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">7.2 Data Deletion</h3>
          <p className="mb-4">
            You can request deletion of your account and all associated data by contacting us. Note that some information may be retained for legal or legitimate business purposes.
          </p>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">7.3 Data Portability</h3>
          <p className="mb-4">
            You can request a copy of your game data in a machine-readable format.
          </p>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-400">7.4 Opt-Out</h3>
          <p className="mb-4">
            You can opt out of promotional communications and certain data collection through your account settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">8. Children's Privacy</h2>
          <p className="mb-4">
            Xtreme Reaction is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately. If you believe we have information from or about a child under 13, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">9. International Data Transfers</h2>
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. By using our game, you consent to the transfer of information to countries outside your country of residence.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">10. California Privacy Rights (CCPA)</h2>
          <p className="mb-4">
            California residents have additional rights under the California Consumer Privacy Act (CCPA), including:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to opt-out of the sale of personal information</li>
            <li>Right to delete personal information</li>
            <li>Right to non-discrimination for exercising privacy rights</li>
          </ul>
          <p className="mb-4">
            We do not sell personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">11. European Privacy Rights (GDPR)</h2>
          <p className="mb-4">
            If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR), including:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">12. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Material changes will be notified via the game interface or email (if provided).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-neon-green">13. Contact Information</h2>
          <p className="mb-4">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="mb-2"><strong className="text-green-400">Email:</strong> privacy@xtremereaction.com</p>
            <p className="mb-2"><strong className="text-green-400">X (Twitter):</strong> @XtremeReaction</p>
            <p><strong className="text-green-400">Website:</strong> https://xtreme-reaction.vercel.app</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            By using Xtreme Reaction, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}