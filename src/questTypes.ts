import { Runner } from 'overlay'

export interface Reward {
  id: number
  amount_per_user: string | null
  chain_id: number | null
  marketplace_url: string | null
  reward_type: 'ERC20' | 'ERC721' | 'ERC1155' | 'POINTS' | 'EXTERNAL-TASKS'
  name: string
  contract_address: `0x${string}`
  decimals: number | null
  token_ids: {
    id: number
    name: string
    status: string
    amount_per_user: string
    token_id: number
    numClaimsLeft: string
  }[]
  image_url: string
  numClaimsLeft: string
}

export type QuestStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'CLAIMABLE' | 'COMPLETED'

export interface Quest {
  id: number
  project_id: string
  name: string
  type: 'REPUTATIONAL-AIRDROP' | 'PLAYSTREAK'
  status: QuestStatus
  description: string
  rewards?: Reward[]
  /* eslint-disable-next-line */
  deposit_contracts: any[]
  eligibility?: {
    completion_threshold?: number
    steam_games: { id: string }[]
    play_streak: {
      required_playstreak_in_days: number
      minimum_session_time_in_seconds: number
    }
  }
  quest_external_game: null | {
    store_redirect_url: string
    runner: Runner
  }
  num_of_times_repeatable: number | null
}

export interface RewardClaimSignature {
  signature: `0x${string}`
  nonce: string
  expiration: number
  tokenIds: number[]
}

export interface DepositContract {
  contract_address: `0x${string}`
  chain_id: number
}

export interface GenericApiResponse {
  status?: string
  message: string
}

export interface PointsClaimReturn {
  // sent on error
  status?: string
  message?: string
  // sent on success
  success?: string
}

export interface ConfirmClaimParams {
  transactionHash: string
  signature: string
}

export interface UserPlayStreak {
  current_playstreak_in_days: number
  completed_counter: number
  accumulated_playtime_today_in_seconds: number
  last_play_session_completed_datetime: string
}

export interface PointsCollection {
  id: string
  name: string
  symbol: string
  image: string
}
