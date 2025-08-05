// /src/components/PageWrapper.tsx

import { ReactNode, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

type OutletContextType = { setPageTitle?: (title: string) => void }

declare global {
  interface Window {
    APP_NAME?: string
  }
}

type PageWrapperProps = {
  title: string
  children: ReactNode
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
  const { setPageTitle } = useOutletContext<OutletContextType>()

  useEffect(() => {
    const appName = window.APP_NAME || "My App"
    document.title = `${title} | ${appName}`
    setPageTitle?.(title)
  }, [title, setPageTitle])

  return <>{children}</>
}