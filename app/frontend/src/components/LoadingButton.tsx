// /src/components/LoadingButton.tsx

import { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger"
type Size = "sm" | "md" | "lg"

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: ReactNode
  variant?: Variant
  size?: Size
}

export default function LoadingButton({
  loading = false,
  children,
  disabled,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: LoadingButtonProps) {
  const baseClasses =
    "flex items-center justify-center rounded font-medium transition"

  const variantClasses: Record<Variant, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    secondary:
      "bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  }

  const sizeClasses: Record<Size, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

// cara penggunaan

// <LoadingButton
//   type="submit"
//   loading={loading}
//   variant="primary"
//   size="md"
// >
//   Login
// </LoadingButton>

// <LoadingButton
//   loading={deleting}
//   variant="danger"
//   size="sm"
// >
//   Hapus
// </LoadingButton>

// <LoadingButton
//   loading={saving}
//   variant="secondary"
//   size="lg"
// >
//   Simpan
// </LoadingButton>