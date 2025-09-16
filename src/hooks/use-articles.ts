import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'

export type Article = {
  id: string
  title: string
  description: string
  image_url: string
  tags: string[]
  level: string
  cta: string
  link: string
  platform: 'youtube' | 'tiktok'
  // SEO fields
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
}

export interface ArticlesResponse {
  articles: Article[]
  totalCount: number
}

export interface ArticleFilterParams {
  search?: string
  level?: string
  limit?: number
  offset?: number
}

// Server-side filtering and pagination
export function useFilteredArticles(params: ArticleFilterParams = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    `articles-filtered-${JSON.stringify(params)}`,
    async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('articles')
        .select(`
          id,
          title,
          description,
          image_url,
          tags,
          level,
          cta,
          link,
          platform,
          seo_title,
          seo_description,
          created_at,
          updated_at
        `, { count: 'exact' })

      // Apply filters
      if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
      }

      if (params.level) {
        query = query.eq('level', params.level)
      }

      // Apply pagination
      const limit = params.limit || 10
      const offset = params.offset || 0
      query = query.range(offset, offset + limit - 1)

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      const { data: articles, error, count } = await query

      if (error) throw error

      return {
        articles: articles || [],
        totalCount: count || 0
      } as ArticlesResponse
    }
  )

  return {
    articles: data?.articles || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    mutate
  }
}

// Legacy hook for backward compatibility
export function useArticles() {
  const { data, error, isLoading, mutate } = useSWR('articles', async () => {
    const supabase = createClient()
    
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        description,
        image_url,
        tags,
        level,
        cta,
        link,
        platform,
        seo_title,
        seo_description,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return articles || []
  })

  return {
    articles: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useArticle(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `article-${id}` : null,
    async () => {
      const supabase = createClient()
      
      const { data: article, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          description,
          image_url,
          tags,
          level,
          cta,
          link,
          platform,
          seo_title,
          seo_description,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return article
    }
  )

  return {
    article: data,
    isLoading,
    error,
    mutate
  }
}