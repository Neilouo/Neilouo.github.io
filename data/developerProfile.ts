export interface Certification {
  name: string
  issuer: string
  issued: string
  expires?: string
  credentialId?: string
  credentialUrl?: string
  skills?: string[]
  logo?: string
  accent: string
}

export interface KaggleBadge {
  name: string
  icon?: string
}

export interface KaggleCompetition {
  name: string
  rank: number
  total: number
}

export interface KaggleProfile {
  username: string
  displayName: string
  location: string
  tier: string
  competitions: KaggleCompetition[]
  badges: KaggleBadge[]
}

export const certifications: Certification[] = [
  {
    name: 'Oracle AI Vector Search Certified Professional',
    issuer: 'Oracle',
    issued: '2025-05',
    expires: '2027-05',
    accent: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    logo: 'https://www.google.com/s2/favicons?domain=oracle.com&sz=32'
  },
  {
    name: 'Oracle APEX Cloud Developer Certified Professional',
    issuer: 'Oracle',
    issued: '2025-05',
    accent: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    logo: 'https://www.google.com/s2/favicons?domain=oracle.com&sz=32'
  },
  {
    name: 'Deloitte Australia',
    issuer: 'Deloitte',
    issued: '2024-08',
    credentialId: 'pwatJDmnuzvMwZgqi',
    skills: ['Tableau', 'Python', 'Data Analysis'],
    accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    logo: 'https://www.google.com/s2/favicons?domain=deloitte.com&sz=32'
  },
  {
    name: 'Melbourne Plus: Community Engagement',
    issuer: 'University of Melbourne',
    issued: '2024-08',
    credentialId: '66b9857830d1a05d2e44d5b4',
    accent: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    logo: 'https://www.google.com/s2/favicons?domain=unimelb.edu.au&sz=32'
  }
]

export const kaggleProfile: KaggleProfile = {
  username: 'sangnan',
  displayName: 'Nan Sang',
  location: 'Melbourne, Victoria, Australia',
  tier: 'Contributor',
  competitions: [
    { name: 'The Global Multimedia Deepfake Detection', rank: 473, total: 706 }
  ],
  badges: [
    { name: 'Completed 5-Day Gen AI Intensive' },
    { name: 'Getting Started Competitor' },
    { name: 'Community Competitor' },
    { name: 'Python Coder' },
    { name: 'Notebook Modeler' },
    { name: 'Code Forker' },
    { name: 'Agent of Discord' },
    { name: 'Kaggle Community Member' },
    { name: '2 Years on Kaggle' },
    { name: '1 Year on Kaggle' },
    { name: '7 Day Login Streak' }
  ]
}
