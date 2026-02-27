import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiDownload, FiExternalLink } from 'react-icons/fi'
import { T, useI18n } from '../I18nProvider'

const PDFViewer = dynamic(() => import('../PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-warm-100 dark:bg-warm-900 rounded-card">
      <p className="text-sm text-warm-400">Loading...</p>
    </div>
  )
})

export default function ResumeSection() {
  const { lang } = useI18n()
  const [resumeLang, setResumeLang] = useState('zh')

  useEffect(() => {
    setResumeLang(lang)
  }, [lang])

  const resumeFile = resumeLang === 'zh' ? '/resume_zh.pdf' : '/resume_en.pdf'

  return (
    <section className="mb-16">
      <h2 className="text-lg font-semibold text-warm-800 dark:text-warm-100 mb-6">
        <T k={'resume'} />
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
           <button
             onClick={() => setResumeLang('zh')}
             className={`px-4 py-2 text-sm font-medium rounded-card transition-colors ${
               resumeLang === 'zh'
                 ? 'bg-accent text-white'
                 : 'bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
             }`}
           >
             中文简历
           </button>
           <button
             onClick={() => setResumeLang('en')}
             className={`px-4 py-2 text-sm font-medium rounded-card transition-colors ${
               resumeLang === 'en'
                 ? 'bg-accent text-white'
                 : 'bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700'
             }`}
           >
             English Resume
           </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={resumeFile}
            download={`NanSang_CV_${resumeLang}.pdf`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-card bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            <FiDownload className="w-4 h-4" /> <T k={'download_pdf'} />
          </a>
          <a
            href={resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-card border border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-200 text-sm font-medium hover:bg-warm-50 dark:hover:bg-warm-800 transition-colors"
          >
            <FiExternalLink className="w-4 h-4" /> <T k={'preview_online'} />
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-warm-100 dark:border-warm-800 overflow-hidden bg-white dark:bg-warm-950">
        <div className="p-4">
          <PDFViewer file={resumeFile} />
        </div>
      </div>
    </section>
  )
}
