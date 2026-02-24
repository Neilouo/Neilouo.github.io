const FALLBACK_URL = 'https://lptqykocinwlojjzfqhy.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

export const getSupabaseUrl = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL

export const getSupabaseKey = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_KEY || FALLBACK_KEY

export const logSupabaseConfig = (component: string): void => {
  console.log(`${component} Supabase 配置:`, {
    url: getSupabaseUrl(),
    keySet: '✅ 已设置',
    projectId: getSupabaseUrl().split('.')[0].split('//')[1]
  })
} 