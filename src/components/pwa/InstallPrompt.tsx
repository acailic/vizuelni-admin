'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, X, Smartphone, Wifi, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('pwa-install-dismissed')
    if (stored) {
      setDismissed(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay if not dismissed
      if (!dismissed) {
        setTimeout(() => setIsVisible(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
    }
  }, [dismissed])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsVisible(false)
        setDeferredPrompt(null)
      }
    } catch {
      // Installation failed
    } finally {
      setIsInstalling(false)
    }
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }, [])

  const handleLater = useCallback(() => {
    setIsVisible(false)
  }, [])

  if (!isVisible || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="rounded-xl border border-gov-primary/20 bg-gradient-to-br from-gov-primary to-blue-700 p-4 text-white shadow-lg">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Инсталирај апликацију</h3>
              <p className="text-xs text-white/80">Визуелни Администратор</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1 hover:bg-white/10"
            aria-label="Затвори"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Benefits */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs">
            <Wifi className="h-3 w-3" />
            Offline приступ
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs">
            <Zap className="h-3 w-3" />
            Брже учитавање
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs">
            <Smartphone className="h-3 w-3" />
            Нативно искуство
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg bg-gov-accent px-4 py-2 font-medium transition-colors',
              'hover:bg-gov-accent/90 disabled:opacity-50'
            )}
          >
            {isInstalling ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Инсталирање...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Инсталирај
              </>
            )}
          </button>
          <button
            onClick={handleLater}
            className="rounded-lg px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Касније
          </button>
        </div>
      </div>
    </div>
  )
}
