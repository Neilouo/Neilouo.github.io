import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true
})

const isProduction = process.env.NODE_ENV === 'production'
const repository = process.env.GITHUB_REPOSITORY?.toLowerCase()
const isUserPagesRepo = repository === 'neilouo/neilouo.github.io'
const repoBasePath = '/Neilouo.github.io'
const useRepoSubPath = isProduction && repository != null && !isUserPagesRepo

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: useRepoSubPath ? repoBasePath : '',
  assetPrefix: useRepoSubPath ? `${repoBasePath}/` : undefined,
  async redirects () {
    return [
      {
        source: '/WorkExperience',
        destination: '/about',
        permanent: true
      },
      {
        source: '/CurriculumVitae',
        destination: '/about',
        permanent: true
      },
      {
        source: '/Research',
        destination: '/blog',
        permanent: true
      }
    ]
  }
})
