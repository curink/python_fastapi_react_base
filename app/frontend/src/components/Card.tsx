// /src/components/Card.tsx

import { ReactNode } from "react"

type CardProps = {
  title: string
  children: ReactNode
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 w-full">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      {children}
    </div>
  )
}