import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LimitsMessage from '../components/LimitsMessage'
import styles from '../components/LimitsMessage/LimitsMessage.module.css'

describe('LimitsMessage', () => {
  describe('Rendering', () => {
    it('should render the error message correctly', () => {
      const testMessage = 'Transaction limit exceeded'
      render(<LimitsMessage message={testMessage} />)

      const messageElement = screen.getByText(testMessage)
      expect(messageElement).toBeInTheDocument()
    })

    it('should render with the correct container class', () => {
      const { container } = render(<LimitsMessage message="Test message" />)
      const containerElement = container.querySelector(`.${styles.container}`)

      expect(containerElement).toBeInTheDocument()
    })

    it('should render the icon wrapper with correct class', () => {
      const { container } = render(<LimitsMessage message="Test message" />)
      const iconWrapper = container.querySelector(`.${styles.iconWrapper}`)

      expect(iconWrapper).toBeInTheDocument()
    })

    it('should render the SVG icon', () => {
      const { container } = render(<LimitsMessage message="Test message" />)
      const svgIcon = container.querySelector('svg')

      expect(svgIcon).toBeInTheDocument()
      expect(svgIcon).toHaveAttribute('aria-hidden', 'true')
    })

    it('should render the message with correct class', () => {
      render(<LimitsMessage message="Test message" />)
      const messageElement = screen.getByText('Test message')

      expect(messageElement.tagName).toBe('P')
      expect(messageElement).toHaveClass(styles.message)
    })
  })

  describe('Content', () => {
    it('should display short messages correctly', () => {
      const shortMessage = 'Error'
      render(<LimitsMessage message={shortMessage} />)

      expect(screen.getByText(shortMessage)).toBeInTheDocument()
    })

    it('should display long messages correctly', () => {
      const longMessage =
        'The transaction could not be processed due to exceeding the daily transaction limit. Please try again tomorrow or contact support.'
      render(<LimitsMessage message={longMessage} />)

      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('should handle messages with special characters', () => {
      const specialMessage = 'Error: Invalid amount ($100.00)'
      render(<LimitsMessage message={specialMessage} />)

      expect(screen.getByText(specialMessage)).toBeInTheDocument()
    })

    it('should handle empty string messages', () => {
      const { container } = render(<LimitsMessage message="" />)
      const containerElement = container.querySelector(`.${styles.container}`)
      const messageElement = container.querySelector(`.${styles.message}`)

      expect(containerElement).toBeInTheDocument()
      expect(messageElement).toHaveTextContent('')
    })

    it('should handle undefined message prop with default empty string', () => {
      const { container } = render(<LimitsMessage message={undefined} />)
      const messageElement = container.querySelector(`.${styles.message}`)

      expect(messageElement).toBeInTheDocument()
      expect(messageElement).toHaveTextContent('')
    })

    it('should handle null message prop with default empty string', () => {
      const { container } = render(<LimitsMessage message={null} />)
      const messageElement = container.querySelector(`.${styles.message}`)

      expect(messageElement).toBeInTheDocument()
      expect(messageElement).toHaveTextContent('')
    })

    it('should handle missing message prop with default empty string', () => {
      const { container } = render(<LimitsMessage />)
      const messageElement = container.querySelector(`.${styles.message}`)

      expect(messageElement).toBeInTheDocument()
      expect(messageElement).toHaveTextContent('')
    })
  })

  describe('Structure', () => {
    it('should have the correct component structure', () => {
      const { container } = render(<LimitsMessage message="Test" />)

      const containerElement = container.querySelector(`.${styles.container}`)
      const iconWrapper = container.querySelector(`.${styles.iconWrapper}`)
      const contentWrapper = container.querySelector(`.${styles.content}`)
      const icon = container.querySelector(`.${styles.icon}`)
      const message = container.querySelector(`.${styles.message}`)

      expect(containerElement).toBeInTheDocument()
      expect(iconWrapper).toBeInTheDocument()
      expect(contentWrapper).toBeInTheDocument()
      expect(icon).toBeInTheDocument()
      expect(message).toBeInTheDocument()
    })

    it('should have icon wrapper as first child and content as second child', () => {
      const { container } = render(<LimitsMessage message="Test" />)
      const containerElement = container.querySelector(`.${styles.container}`)
      const children = containerElement?.children

      expect(children?.[0]).toHaveClass(styles.iconWrapper)
      expect(children?.[1]).toHaveClass(styles.content)
    })
  })

  describe('Accessibility', () => {
    it('should have aria-hidden on decorative icon', () => {
      const { container } = render(<LimitsMessage message="Test" />)
      const svgIcon = container.querySelector('svg')

      expect(svgIcon).toHaveAttribute('aria-hidden', 'true')
    })

    it('should render message text in a semantic paragraph element', () => {
      render(<LimitsMessage message="Test message" />)
      const messageElement = screen.getByText('Test message')

      expect(messageElement.tagName).toBe('P')
    })
  })

  describe('SVG Icon', () => {
    it('should render SVG with correct attributes', () => {
      const { container } = render(<LimitsMessage message="Test" />)
      const svgIcon = container.querySelector('svg')

      expect(svgIcon).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
      expect(svgIcon).toHaveAttribute('viewBox', '0 0 20 20')
      expect(svgIcon).toHaveAttribute('fill', 'currentColor')
    })

    it('should render SVG path with correct attributes', () => {
      const { container } = render(<LimitsMessage message="Test" />)
      const svgPath = container.querySelector('svg path')

      expect(svgPath).toBeInTheDocument()
      expect(svgPath).toHaveAttribute('fill-rule', 'evenodd')
      expect(svgPath).toHaveAttribute('clip-rule', 'evenodd')
    })
  })

  describe('Props', () => {
    it('should accept and render message prop', () => {
      const testMessage = 'Custom error message'
      render(<LimitsMessage message={testMessage} />)

      expect(screen.getByText(testMessage)).toBeInTheDocument()
    })

    it('should update when message prop changes', () => {
      const { rerender } = render(<LimitsMessage message="Initial message" />)
      expect(screen.getByText('Initial message')).toBeInTheDocument()

      rerender(<LimitsMessage message="Updated message" />)
      expect(screen.getByText('Updated message')).toBeInTheDocument()
      expect(screen.queryByText('Initial message')).not.toBeInTheDocument()
    })
  })

  describe('Snapshot', () => {
    it('should match snapshot with standard message', () => {
      const { container } = render(<LimitsMessage message="Transaction limit exceeded" />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
