export interface Certification {
  id: string
  name: { zh: string; en: string }
  issuer: { zh: string; en: string }
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  skills?: string[]
  logo: string
  color: string
}

export const certifications: Certification[] = [
  {
    id: 'oracle-ai-vector',
    name: {
      zh: 'Oracle AI Vector Search 认证专家',
      en: 'Oracle AI Vector Search Certified Professional'
    },
    issuer: { zh: 'Oracle', en: 'Oracle' },
    issueDate: '2025-05',
    expiryDate: '2027-05',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/oracle.svg',
    color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300'
  },
  {
    id: 'oracle-apex',
    name: {
      zh: 'Oracle APEX Cloud 开发者认证专家',
      en: 'Oracle APEX Cloud Developer Certified Professional'
    },
    issuer: { zh: 'Oracle', en: 'Oracle' },
    issueDate: '2025-05',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/oracle.svg',
    color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300'
  },
  {
    id: 'deloitte-au',
    name: {
      zh: 'Deloitte Australia 认证',
      en: 'Deloitte Australia'
    },
    issuer: { zh: 'Deloitte', en: 'Deloitte' },
    issueDate: '2024-08',
    credentialId: 'pwatJDmnuzvMwZgqi',
    skills: ['Tableau', 'Python', 'Data Analysis'],
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/deloitte.svg',
    color: 'text-green-700 bg-green-50 dark:bg-green-500/10 dark:text-green-300'
  },
  {
    id: 'unimelb-community',
    name: {
      zh: 'Melbourne Plus: 社区参与',
      en: 'Melbourne Plus: Community Engagement'
    },
    issuer: { zh: '墨尔本大学', en: 'University of Melbourne' },
    issueDate: '2024-08',
    credentialId: '66b9857830d1a05d2e44d5b4',
    logo: '/images/unimelb-logo.svg',
    color: 'text-blue-700 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-300'
  }
]
