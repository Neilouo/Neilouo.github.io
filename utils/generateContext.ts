import type { Context, contextChild, contextItems } from '../types'

export default function generateContext (json: Record<string, unknown> | null, title: string): Context {
  const context: Context = {
    title,
    children: []
  }
  
  if (!json || typeof json !== 'object') {
    return context
  }
  
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key) && key) {
      const value = json[key] as { title?: string } | string | undefined
      if (key.startsWith('--')) {
        const child: contextItems = {
          title: (typeof value === 'object' ? value?.title : undefined) || '',
          children: []
        }
        context.children.push(child)
      } else {
        const child: contextChild = {
          link: (typeof value === 'string' ? value : undefined) || key,
          title: key
        }
        if (context.children.length === 0) {
          context.children.push({
            title: '',
            children: []
          })
        }
        context.children[context.children.length - 1].children.push(child)
      }
    }
  }
  return context
}
