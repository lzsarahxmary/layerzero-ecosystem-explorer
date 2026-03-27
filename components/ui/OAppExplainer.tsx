'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Code2, Shield, Zap, Link2, Settings, ArrowRight, ExternalLink, Network, Lock, Box } from 'lucide-react'

interface OAppExplainerProps {
  isOpen: boolean
  onClose: () => void
}

const requirements = [
  {
    icon: Code2,
    title: 'Inherit OApp.sol',
    description:
      'Your contract must extend OApp.sol, which wires in crosschain send/receive capabilities and connects to the local LayerZero Endpoint.',
  },
  {
    icon: Network,
    title: 'LayerZero Endpoint V2',
    description:
      'Each OApp connects to the immutable Endpoint deployed on its chain. On most EVM chains the address is 0x1a44…728c.',
    mono: '0x1a44076050125825900e736c501f859c50fE728c',
  },
  {
    icon: Link2,
    title: 'Peer Configuration',
    description:
      'Call setPeer() on every deployment to whitelist the corresponding OApp address on each remote chain. Without peers, messages are rejected.',
  },
  {
    icon: Shield,
    title: 'Security Stack (DVN)',
    description:
      'Configure one or more Decentralized Verifier Networks that independently verify every crosschain message before it can be executed.',
  },
  {
    icon: Zap,
    title: 'Executor',
    description:
      'The Executor abstracts destination-chain gas — it pays for and delivers the message so end-users never need native tokens on the target chain.',
  },
  {
    icon: Settings,
    title: 'Message Libraries',
    description:
      'SendUln302 and ReceiveUln302 must be set as the send and receive libraries. They encode, decode, and route packets through the protocol.',
  },
  {
    icon: Lock,
    title: 'Enforced Options',
    description:
      'Define minimum gas limits for _lzReceive() execution on the destination chain to prevent out-of-gas reverts.',
  },
  {
    icon: Box,
    title: '_lzReceive()',
    description:
      'Implement this callback to handle incoming crosschain messages. It is invoked by the Endpoint once the DVN set has verified the packet.',
  },
  {
    icon: ArrowRight,
    title: '_lzSend()',
    description:
      'Call this internal helper to dispatch messages to remote chains. It encodes the payload and routes it through the configured send library.',
  },
]

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panel = {
  hidden: { opacity: 0, x: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', damping: 28, stiffness: 260 },
  },
  exit: { opacity: 0, x: 40, scale: 0.97, transition: { duration: 0.2 } },
}

export default function OAppExplainer({ isOpen, onClose }: OAppExplainerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-end"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative mr-4 flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0A0A0A] shadow-2xl"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  What makes an OApp?
                </h2>
                <p className="mt-0.5 text-sm text-neutral-400">
                  Omnichain Application — LayerZero V2
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800">
              {/* Architecture diagram */}
              <div className="mb-8 rounded-xl border border-[#1a1a1a] bg-[#111] p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-500">
                  Architecture Overview
                </p>

                <div className="flex flex-col items-center gap-3">
                  {/* Source chain */}
                  <div className="flex w-full items-center gap-3">
                    <div className="flex flex-1 flex-col items-center rounded-lg border border-[#1a1a1a] bg-[#0A0A0A] px-4 py-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        Source Chain
                      </span>
                      <span className="mt-1 text-sm font-semibold text-white">
                        Your OApp
                      </span>
                      <span className="mt-0.5 font-mono text-[10px] text-emerald-400">
                        inherits OApp.sol
                      </span>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-neutral-600" />
                    <div className="flex flex-1 flex-col items-center rounded-lg border border-[#1a1a1a] bg-[#0A0A0A] px-4 py-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        Endpoint V2
                      </span>
                      <span className="mt-1 font-mono text-[10px] text-sky-400">
                        0x1a44…728c
                      </span>
                    </div>
                  </div>

                  {/* Middle: security + executor */}
                  <div className="flex w-full items-center gap-3">
                    <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] bg-[#0e0e0e] px-4 py-2.5">
                      <Shield size={12} className="text-amber-400" />
                      <span className="text-xs text-neutral-300">DVNs verify</span>
                    </div>
                    <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] bg-[#0e0e0e] px-4 py-2.5">
                      <Zap size={12} className="text-violet-400" />
                      <span className="text-xs text-neutral-300">Executor delivers</span>
                    </div>
                  </div>

                  {/* Message libraries */}
                  <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] bg-[#0e0e0e] px-4 py-2.5">
                    <Settings size={12} className="text-neutral-400" />
                    <span className="font-mono text-[10px] text-neutral-400">
                      SendUln302 → ReceiveUln302
                    </span>
                  </div>

                  {/* Destination chain */}
                  <div className="flex w-full items-center gap-3">
                    <div className="flex flex-1 flex-col items-center rounded-lg border border-[#1a1a1a] bg-[#0A0A0A] px-4 py-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        Endpoint V2
                      </span>
                      <span className="mt-1 font-mono text-[10px] text-sky-400">
                        0x1a44…728c
                      </span>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-neutral-600" />
                    <div className="flex flex-1 flex-col items-center rounded-lg border border-[#1a1a1a] bg-[#0A0A0A] px-4 py-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        Destination Chain
                      </span>
                      <span className="mt-1 text-sm font-semibold text-white">
                        Peer OApp
                      </span>
                      <span className="mt-0.5 font-mono text-[10px] text-emerald-400">
                        _lzReceive()
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements list */}
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-500">
                Integration Requirements
              </p>

              <ul className="flex flex-col gap-3">
                {requirements.map(({ icon: Icon, title, description, mono }, i) => (
                  <motion.li
                    key={title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25 }}
                    className="group rounded-xl border border-[#1a1a1a] bg-[#111] px-4 py-3.5 transition-colors hover:border-[#2a2a2a]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-neutral-400 transition-colors group-hover:text-white">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-400">
                          {description}
                        </p>
                        {mono && (
                          <code className="mt-1.5 inline-block rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-sky-400">
                            {mono}
                          </code>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-[#1a1a1a] px-6 py-4">
              <a
                href="https://docs.layerzero.network/v2/developers/evm/oft/quickstart"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Read Docs
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
