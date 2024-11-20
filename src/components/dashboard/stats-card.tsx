interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  className?: string
}

export function StatsCard({ title, value, description, className }: StatsCardProps) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}
