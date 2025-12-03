'use client'

import { useState } from 'react'

interface SendResult {
  number: string
  status: 'success' | 'error'
  message: string
  messageId?: string
}

interface SendResponse {
  success: boolean
  results: SendResult[]
  summary: {
    total: number
    successful: number
    failed: number
  }
}

export default function WhatsAppPage() {
  const [numbers, setNumbers] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SendResult[]>([])
  const [summary, setSummary] = useState<SendResponse['summary'] | null>(null)

  const handleSubmit = async () => {
    if (!numbers.trim() || !message.trim()) {
      return
    }

    setLoading(true)
    setResults([])
    setSummary(null)

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numbers: numbers.trim(),
          message: message.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send messages')
      }

      const data: SendResponse = await response.json()
      setResults(data.results)
      setSummary(data.summary)
    } catch (error) {
      console.error('Error sending messages:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col max-w-3xl w-full gap-8 px-6 py-8">
      <div className="flex flex-col gap-4 items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          WhatsApp Bulk Messaging
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Send messages to multiple WhatsApp numbers at once
        </p>
      </div>

      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Numbers
          </label>
          <textarea
            id="numbers"
            placeholder="Enter phone numbers, one per line (e.g., +521234567890)"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            rows={6}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Include country code (e.g., +52 for Mexico)
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !numbers.trim() || !message.trim()}
          className="w-full px-6 py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Sending...' : 'Send Messages'}
        </button>
      </div>

      {summary && (
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Results Summary
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full">
              Total: {summary.total}
            </span>
            <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
              Sent: {summary.successful}
            </span>
            <span className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
              Failed: {summary.failed}
            </span>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Results
          </h2>
          <div className="flex flex-col gap-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4"
              >
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {result.number}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      result.status === 'success'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {result.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {result.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
