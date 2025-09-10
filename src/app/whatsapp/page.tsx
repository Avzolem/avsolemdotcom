'use client'

import { useState } from 'react'
import { Button, Flex, Text, Heading, Badge, Textarea, Column } from '@once-ui-system/core'

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
    <Column maxWidth="m" fillWidth gap="xl" paddingX="l" paddingTop="xl" paddingBottom="xl">
      <Flex direction="column" gap="m" align="center">
        <Heading variant="display-strong-s">WhatsApp Bulk Messaging</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Send messages to multiple WhatsApp numbers at once
        </Text>
      </Flex>

      <Flex fillWidth direction="column" gap="l">
        <Flex direction="column" gap="s">
          <Text variant="label-default-s">Phone Numbers</Text>
          <Textarea
            id="numbers"
            placeholder="Enter phone numbers, one per line (e.g., +521234567890)"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            rows={6}
            required
          />
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Include country code (e.g., +52 for Mexico)
          </Text>
        </Flex>

        <Flex direction="column" gap="s">
          <Text variant="label-default-s">Message</Text>
          <Textarea
            id="message"
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </Flex>

        <Button
          onClick={handleSubmit}
          disabled={loading || !numbers.trim() || !message.trim()}
          variant="primary"
          size="l"
        >
          {loading ? 'Sending...' : 'Send Messages'}
        </Button>
      </Flex>

      {summary && (
        <Flex direction="column" gap="m" fillWidth>
          <Heading variant="heading-strong-m">Results Summary</Heading>
          <Flex gap="s" wrap>
            <Badge background="neutral-alpha-weak" paddingX="12" paddingY="4">
              Total: {summary.total}
            </Badge>
            <Badge background="success-alpha-weak" paddingX="12" paddingY="4">
              Sent: {summary.successful}
            </Badge>
            <Badge background="danger-alpha-weak" paddingX="12" paddingY="4">
              Failed: {summary.failed}
            </Badge>
          </Flex>
        </Flex>
      )}

      {results.length > 0 && (
        <Flex direction="column" gap="m" fillWidth>
          <Heading variant="heading-strong-m">Detailed Results</Heading>
          <Flex direction="column" gap="s">
            {results.map((result, index) => (
              <Flex
                key={index}
                padding="m"
                border="neutral-medium"
                radius="m"
                direction="row"
                align="center"
                gap="m"
                style={{ justifyContent: 'space-between' }}
              >
                <Text variant="body-default-s" style={{ fontFamily: 'monospace' }}>
                  {result.number}
                </Text>
                <Flex align="center" gap="s">
                  <Badge 
                    background={result.status === 'success' ? 'success-alpha-weak' : 'danger-alpha-weak'} 
                    paddingX="12" 
                    paddingY="4"
                  >
                    {result.status}
                  </Badge>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {result.message}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
    </Column>
  )
}