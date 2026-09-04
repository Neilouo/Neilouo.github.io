import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true
})

const isProduction = process.env.NODE_ENV === 'production'

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: isProduction ? '/Neilouo.github.io' : '',
  assetPrefix: isProduction ? '/Neilouo.github.io/' : undefined,
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
