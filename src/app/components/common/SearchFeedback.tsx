// SearchFeedback.tsx
interface SearchFeedbackProps {
  title: string
  message: string
  status: 'neutral' | 'error' | 'success'
}

export default function SearchFeedback({ title, message, status }: SearchFeedbackProps) {
  const statusColors = {
    neutral: 'text-gray-500',
    error: 'text-red-500',
    success: 'text-green-500'
  }

  return (
    <div className="text-center py-12" role="status">
      <h2 className={`text-xl font-medium ${statusColors[status]}`}>
        {title}
      </h2>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  )
}