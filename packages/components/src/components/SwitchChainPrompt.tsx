import { Button } from '@yearn/components/components/Button'
import type { ReactElement } from 'react'

type TSwitchChainPromptProps = {
  chainId: number
  onSwitchChain: () => void
  isSwitching?: boolean
  /** Display name for the chain. Falls back to the id when the host has none. */
  chainName?: string
}

export function SwitchChainPrompt({
  chainId,
  onSwitchChain,
  isSwitching,
  chainName
}: TSwitchChainPromptProps): ReactElement {
  const label = chainName ?? `Chain ${chainId}`

  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface-secondary p-4">
      <span className="text-sm text-text-secondary text-center">Switch to {label} to claim these rewards</span>
      <Button
        onClick={onSwitchChain}
        isBusy={isSwitching}
        variant="filled"
        className="w-full md:w-auto !px-4 !py-1.5 !text-sm whitespace-nowrap"
      >
        Switch Chain
      </Button>
    </div>
  )
}
