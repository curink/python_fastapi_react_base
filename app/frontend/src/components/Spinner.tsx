// src/components/Spinner.jsx

export default function Spinner({ full = true }) {
    const containerClass = full
        ? "fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
        : "flex items-center justify-center bg-transparent dark:bg-transparent"

    return (
        <div className={containerClass}>
            <div className="w-10 h-10 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}