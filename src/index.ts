import EventEmitter from 'events'
import {
  ModalText,
  NOTIFICATION_TYPE,
  OverlayAction,
  TxnStateToTranslation
} from './overlay'

export * from './getAmount'
export * from './overlay'
export * from './parseNumIntoReadableString'
export * from './playstreak'
export * from './getNumClaimsLeft'
export * from './questTypes'

function getDomainNameFromHostName(url: URL) {
  const domainNameParts = url.hostname.split('.')
  if (domainNameParts.length < 3) return url.hostname
  return domainNameParts[1] + '.' + domainNameParts[2]
}

export function domainsAreEqual(url: URL, otherUrl: URL) {
  if (url.hostname === otherUrl.hostname) return true
  const urlDomain = getDomainNameFromHostName(url)
  const otherUrlDomain = getDomainNameFromHostName(otherUrl)
  if (urlDomain === otherUrlDomain) return true
  return false
}

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}

export interface HyperPlayAPI {
  backendEvents: EventEmitter
  updatePopupInOverlay: (show: boolean) => Promise<void>
  logError: (msg: string) => void
  logInfo: (msg: string) => void
  extensionProvider: any
  getMainWindowId: () => number
  openMetaMaskHomePage: (...args: any) => void
  openMetaMaskPortfolioPage: (...args: any) => void
  openMetaMaskSnapsPage: (...args: any) => void
  setBadgeTextInRenderer: (text: string) => void
  openUrl: (url: string) => Promise<string | void>
  captureException: (exception: any) => any
  configFolder: string
  appConfigFolder: string
  publicDir: string
  fixAsarPath: (origin: string) => string
  eventsToCloseMetaMaskPopupOn: string[]
  appIconPath: string
  providerEvents: EventEmitter
  returnExtensionRequestEvents: EventEmitter
  errorExtensionRequestEvents: EventEmitter
  providerRequests: EventEmitter
  toggleOverlay: (arg: { action?: OverlayAction }) => Promise<void>
  removePopup: () => Promise<void>
  getCurrentWeb3Provider: () => any
  i18n: {
    transactions: {
      TITLE: ModalText
      DESCRIPTION: TxnStateToTranslation
      EXTENSION_NOTIFICATION: NOTIFICATION_TYPE
      INITIAL_TOAST: NOTIFICATION_TYPE
    }
  }
  getMetaMaskExtensionId: () => Promise<string>
}

/**
 * @dev used by @hyperplay/overlay and @hyperplay/extension-helper
 * @notice toggles the browser game and desktop game overlays
 * @param action optionally overrides the overlay shown state instead of toggling
 */
export async function toggleOverlay({
  action = 'TOGGLE',
  api
}: {
  action?: OverlayAction
  api: HyperPlayAPI
}) {
  try {
    api.backendEvents.emit('overlayToggled', action)
  } catch (err) {
    console.log(`Error in hp overlay toggle ${err}`)
  }
}

export type MetaMaskInitMethod =
  | 'CREATE'
  | 'SECRET_PHRASE'
  | 'IMPORT'
  | 'MANUAL_IMPORT'

export type ImportableBrowser =
  | 'chrome'
  | 'edge'
  | 'opera'
  | 'brave'
  | 'chromium'
  | 'vivaldi'

export type PackageManager = 'default' | 'flatpak' | 'aur' | 'snap'

export interface BrowserProfile {
  path: string
  imagePath: string
  displayName: string
  name: string
  //if user has not uploaded a profile pic for the new profile in chrome,
  //it will use a given background color and a default icon
  //color is a hex string
  imageBackgroundColor?: string
}

export type MetaMaskImportOptions = Partial<
  Record<ImportableBrowser, Partial<Record<PackageManager, BrowserProfile[]>>>
>

export type GamePageActions = 'install' | 'launch'
