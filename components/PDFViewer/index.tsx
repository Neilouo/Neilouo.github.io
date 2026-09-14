import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${String(pdfjs.version)}/pdf.worker.min.js`
}

function PDFViewer (props: { file: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  function onDocumentLoadSuccess ({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64 bg-warm-100 dark:bg-warm-800 rounded-lg">
        <div className="text-warm-500">Loading PDF...</div>
      </div>
    )
  }

  return (
    <div>
      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => {}}
      >
        {Array.from(new Array(numPages ?? 0), (_el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  )
}

export default PDFViewer
