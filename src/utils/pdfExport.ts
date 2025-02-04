import { jsPDF } from 'jspdf'

interface Message {
  agent: string
  content: string
  timestamp: Date
  type: 'response' | 'info'
  color?: string
}

export const savePDF = (messages: Message[], topic: string) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Set initial position
    let y = 20
    const margin = 20
    const pageWidth = doc.internal.pageSize.width
    const maxWidth = pageWidth - (margin * 2)

    // Add title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(`Debate Topic: ${topic}`, margin, y)
    y += 10

    // Add timestamp
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)
    y += 15

    // Process messages
    doc.setFontSize(11)
    messages.forEach((message) => {
      if (message.type === 'info' && message.agent === 'system') {
        return
      }

      // Set color based on agent
      if (message.agent === 'Blue Agent') {
        doc.setTextColor(59, 130, 246)
      } else if (message.agent === 'Red Agent') {
        doc.setTextColor(239, 68, 68)
      } else {
        doc.setTextColor(0)
      }

      // Format message
      const timestamp = new Date(message.timestamp).toLocaleTimeString()
      const header = `${message.agent} [${timestamp}]:`
      
      // Add header
      doc.setFont('helvetica', 'bold')
      const headerLines = doc.splitTextToSize(header, maxWidth)
      
      // Check if we need a new page
      if (y + (headerLines.length * 7) > doc.internal.pageSize.height - margin) {
        doc.addPage()
        y = margin
      }
      
      doc.text(headerLines, margin, y)
      y += headerLines.length * 7

      // Add content
      doc.setFont('helvetica', 'normal')
      const contentLines = doc.splitTextToSize(message.content, maxWidth)
      
      // Check if we need a new page
      if (y + (contentLines.length * 7) > doc.internal.pageSize.height - margin) {
        doc.addPage()
        y = margin
      }
      
      doc.text(contentLines, margin, y)
      y += contentLines.length * 7 + 5
    })

    // Generate filename
    const sanitizedTopic = topic
      .slice(0, 30)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
    const fileName = `debate-${sanitizedTopic}-${new Date().toISOString().slice(0, 10)}.pdf`

    // Save the PDF
    doc.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  }
}
