'use client'

import { useState, useEffect } from 'react'

interface VestorProps {
  url: string
}

interface CountData {
  page_name: string
  visit_count: number
}

export default function Vestor ({ url }: VestorProps): CountData | undefined {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [data, setData] = useState<CountData | undefined>(undefined)
  let pageName: string
  if (typeof window !== 'undefined') {
    pageName = window.location.pathname
  } else {
    pageName = '/'
  }
  if (pageName === '/') {
    pageName = 'home'
  } else {
    pageName = pageName.replace('/', '')
  }
  const [ip, setIp] = useState<string | undefined>(undefined)

  useEffect(() => {
    void fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      mode: 'cors'
    }).then(async (response) => {
      return await response.json()
    }).then((d: { ip: string }) => {
      setIp(d.ip)
    })
  }, [pageName])

  useEffect(() => {
    if (!loaded) {
      void fetch(`${String(url)}/visit?ip=${ip ?? ''}&page_name=${pageName}`, {
        method: 'GET',
        mode: 'cors'
      }).then(async (response) => {
        return await response.json()
      }).then(() => {
        setLoaded(true)
      })
    }
  }, [url, loaded, ip, pageName])

  useEffect(() => {
    void fetch(`${String(url)}/data?page_name=${pageName}`, {
      method: 'GET',
      mode: 'cors'
    }).then(async (response) => {
      return await response.json()
    }).then((d: CountData) => {
      setData(d)
    })
  }, [url, pageName])

  return data
}
