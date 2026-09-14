import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, supabaseKey } from './supabaseConfig'

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Article {
  id?: number
  slug: string
  title: string
  content: string
  category: string
  created_at?: string
  updated_at?: string
  metadata?: Record<string, unknown>
}

export async function getAllArticles(category?: string): Promise<Article[]> {
  let query = supabase.from('articles').select('*')
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return (data || []) as Article[]
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data as (Article | null)
}

export async function saveArticle(article: Article): Promise<Article> {
  const now = new Date().toISOString()
  const updatedArticle = {
    ...article,
    updated_at: now,
    created_at: article.created_at || now
  }
  
  const { data: existingArticle } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', article.slug)
    .maybeSingle()
  
  let result
  
  if (existingArticle) {
    const { data, error } = await supabase
      .from('articles')
      .update(updatedArticle)
      .eq('id', existingArticle.id)
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    result = data
  } else {
    const { data, error } = await supabase
      .from('articles')
      .insert([updatedArticle])
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    result = data
  }
  
  return result
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('slug', slug)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return true
}

export async function importMarkdownToDatabase(
  category: string,
  slug: string,
  title: string,
  content: string,
  metadata?: Record<string, unknown>
): Promise<Article> {
  const article: Article = {
    slug,
    title,
    content,
    category,
    metadata
  }
  
  return await saveArticle(article)
}
