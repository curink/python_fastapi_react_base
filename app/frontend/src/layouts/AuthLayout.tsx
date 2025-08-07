// /src/layouts/AuthLayout.tsx

import { useState } from "react"
import { Outlet } from "react-router-dom"

export default function AuthLayout(): JSX.Element {
  const [pageTitle, setPageTitle] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Outlet context={{ setPageTitle }} />
    </div>
  )
}