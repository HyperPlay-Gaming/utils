import { chainMap } from '@hyperplay/chains'
import { Chain } from 'wagmi/chains'

type RpcUrls = {
  http: string[]
  webSocket?: string[]
}

type ChainMetadata = (typeof chainMap)[keyof typeof chainMap]

export function parseChainMetadataToWagmiChain(
  chainMetadata: ChainMetadata
): Chain {
  const validRpcs = chainMetadata.chain.rpc.filter(
    (rpc) => !rpc.includes(`\${`)
  )

  const defaultRpcUrl = validRpcs[0]

  if (!defaultRpcUrl) {
    throw new Error('defaultRpcUrl is not defined')
  }

  const rpcUrls: Record<string, RpcUrls> = validRpcs.reduce(
    (acc, url) => {
      acc[url] = {
        http: [url]
      }
      return acc
    },
    {} as Record<string, RpcUrls>
  )

  const wagmiChain: Chain = {
    id: chainMetadata.chain.chainId,
    name: chainMetadata.chain.name,
    nativeCurrency: {
      name: chainMetadata.chain.nativeCurrency.name,
      symbol: chainMetadata.chain.nativeCurrency.symbol,
      decimals: chainMetadata.chain.nativeCurrency.decimals
    },
    rpcUrls: {
      ...rpcUrls,
      default: {
        http: [defaultRpcUrl]
      },
      public: {
        http: [defaultRpcUrl]
      }
    }
  }

  if (
    chainMetadata.chain.explorers &&
    chainMetadata.chain.explorers.length > 0
  ) {
    const defaultExplorer = chainMetadata.chain.explorers[0]

    const otherExplorers = chainMetadata.chain.explorers.slice(1).reduce(
      (acc, explorer) => {
        acc[explorer.name] = {
          name: explorer.name,
          url: explorer.url
        }
        return acc
      },
      {} as Record<string, { name: string; url: string }>
    )

    wagmiChain.blockExplorers = {
      default: defaultExplorer,
      ...otherExplorers
    }
  }

  return wagmiChain
}
