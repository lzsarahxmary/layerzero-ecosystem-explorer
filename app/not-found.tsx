import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          404
        </h1>
        <p className="text-[#666] mb-6">This page doesn&apos;t exist in the LayerZero universe.</p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#007FFF]/10 border border-[#007FFF]/30
                     text-[#007FFF] text-sm hover:bg-[#007FFF]/20 transition-colors"
        >
          Back to Explorer
        </Link>
      </div>
    </div>
  )
}
