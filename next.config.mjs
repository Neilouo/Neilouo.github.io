import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true
})

export default withNextra({
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
