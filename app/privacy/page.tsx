export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-neon-green p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last updated: August 25, 2025</p>
      
      <h2 className="text-xl font-bold mb-2">Information We Collect</h2>
      <p className="mb-4">
        When you sign in with X, we store your username and user ID to track your game scores and display them on leaderboards.
        If you grant permission, we may also store your email address.
      </p>
      
      <h2 className="text-xl font-bold mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Display your username on leaderboards</li>
        <li>Save your game progress and high scores</li>
        <li>Enable social features like score sharing</li>
      </ul>
      
      <h2 className="text-xl font-bold mb-2">Data Storage</h2>
      <p className="mb-4">
        Your data is securely stored in Supabase and is never shared with third parties except X for authentication purposes.
      </p>
      
      <h2 className="text-xl font-bold mb-2">Your Rights</h2>
      <p className="mb-4">
        You can delete your account and all associated data at any time by contacting us.
      </p>
    </div>
  )
}