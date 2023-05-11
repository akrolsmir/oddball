import { RandomMarket } from '../game/MarketScreen'
import { marketsFromApi } from '../game/page'

const NEWEST_URL = 'https://manifold.markets/api/v0/markets?limit=500'
export default async function Game() {
  const markets = await marketsFromApi(NEWEST_URL)
  const binaryMarkets = markets
    .filter((market) => market.outcomeType === 'BINARY')
    .filter((market) => market.volume > 100)
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-6 text-center">🎱ddball</h1>
      <RandomMarket markets={binaryMarkets} />
    </div>
  )
}
