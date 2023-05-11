'use client'

import { useEffect, useState } from 'react'
import { Market } from './page'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function clsx(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// Prob from 0 to 1
function formatPercent(prob: number) {
  return (prob * 100).toFixed(0) + '%'
}

// Return a shuffled copy of the array using the Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = copy[i]
    copy[i] = copy[j]
    copy[j] = x
  }
  return copy
}

function randomBallEmoji() {
  const EMOJIS = ['🎱', '🏀', '⚽️', '🏈', '🥎', '🎾', '🏐', '🏉', '🥏', '🎳']
  return shuffle(EMOJIS)[0]
}

export function RandomMarket(props: { markets: Market[] }) {
  const { markets } = props
  // Return null on first render, so that server and client renders match
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])
  if (!hydrated) return null

  const market = shuffle(markets)[0]
  return <MarketScreen key={market.id} market={market} />
}

export function MarketScreen(props: { market: Market }) {
  const { market } = props
  const router = useRouter()
  const [guess, setGuess] = useState(50)
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      <h1 className="text-2xl mb-6 text-center">{randomBallEmoji()}ddball</h1>
      <h2 className="text-xl font-bold mb-2">{market.question}</h2>
      <p>You: {guess}%</p>
      <input
        type="range"
        min="0"
        max="100"
        className="w-full"
        value={guess}
        onChange={(e) => setGuess(Number(e.target.value))}
      />

      {/* Reveal this once pressed */}

      {!revealed && (
        <div className="flex flex-row">
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setRevealed(true)}
          >
            Guess
          </button>
          {/* Use outline button style */}
          <button
            className="mt-4 ml-4 bg-white text-blue-500 px-4 py-2 rounded-md border border-blue-500"
            onClick={() => router.refresh()}
          >
            Skip
          </button>
        </div>
      )}

      <div className="h-4" />

      {/* Show the difference between your guess and revealed value */}
      {revealed && (
        <>
          <p>Market: {formatPercent(market.probability)}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={market.probability * 100}
            className="w-full"
            readOnly
          />
          <p>
            You were{' '}
            <span className="font-bold">
              {Math.abs(guess - market.probability * 100).toFixed(0)}%{' '}
            </span>
            off from the market.
            <iframe
              src={market.url}
              width="100%"
              height="400px"
              className={clsx('w-full', revealed ? '' : 'invisible')}
            ></iframe>
          </p>

          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => router.refresh()}
          >
            Next
          </button>
        </>
      )}
    </div>
  )
}
