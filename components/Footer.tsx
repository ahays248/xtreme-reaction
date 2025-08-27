import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-gray-500">
            © 2024 Xtreme Reaction. All rights reserved.
          </div>
          
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/privacy" 
              className="text-xs sm:text-sm text-gray-400 hover:text-neon-green transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            
            <Link 
              href="/terms" 
              className="text-xs sm:text-sm text-gray-400 hover:text-neon-green transition-colors duration-200"
            >
              Terms of Service
            </Link>
            
            <a 
              href="https://x.com/XtremeReaction" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-gray-400 hover:text-neon-green transition-colors duration-200 flex items-center gap-1"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline-block"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="hidden sm:inline">Follow</span>
            </a>
          </nav>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-[10px] sm:text-xs text-gray-600">
            By playing Xtreme Reaction, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  )
}