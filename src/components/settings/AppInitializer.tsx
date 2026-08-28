import React, { useEffect, useState } from 'react'
import { OnboardingDialog } from './OnboardingDialog'
import { useAppStore } from '../../store'

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { settings, updateSettings } = useAppStore()

  useEffect(() => {
    // 检查是否需要显示引导
    const hasCompletedOnboarding = localStorage.getItem('deepseekharm_onboarding_complete')
    if (!hasCompletedOnboarding && !settings.apiKey) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = (config: { apiKey: string; model: string }) => {
    updateSettings({ apiKey: config.apiKey, model: config.model })
    localStorage.setItem('deepseekharm_onboarding_complete', 'true')
    setShowOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    localStorage.setItem('deepseekharm_onboarding_complete', 'true')
    setShowOnboarding(false)
  }

  return (
    <>
      {children}
      <OnboardingDialog
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </>
  )
}
