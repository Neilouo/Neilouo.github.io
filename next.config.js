const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true
})

module.exports = withNextra({
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
