import { createClient } from '@/utils/supabase/client'
import { mutate } from 'swr'
import type { Article } from './use-articles'

export function useArticleMutations() {
  const supabase = createClient()

  const createArticle = async (articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: articleData.title,
        description: articleData.description,
        image_url: articleData.image_url,
        tags: articleData.tags,
        level: articleData.level,
        cta: articleData.cta,
        link: articleData.link,
        platform: articleData.platform,
        seo_title: articleData.seo_title,
        seo_description: articleData.seo_description
      }])
      .select()
      .single()

    if (error) throw error
    
    // Revalidate articles list
    mutate(key => typeof key === 'string' && key.startsWith('articles'))
    
    return data
  }

  const updateArticle = async (id: string, articleData: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>) => {
    // Only update fields that are provided and not undefined
    const updateData: any = {}
    
    if (articleData.title !== undefined) updateData.title = articleData.title
    if (articleData.description !== undefined) updateData.description = articleData.description
    if (articleData.image_url !== undefined) updateData.image_url = articleData.image_url
    if (articleData.tags !== undefined) updateData.tags = articleData.tags
    if (articleData.level !== undefined) updateData.level = articleData.level
    if (articleData.cta !== undefined) updateData.cta = articleData.cta
    if (articleData.link !== undefined) updateData.link = articleData.link
    if (articleData.platform !== undefined) updateData.platform = articleData.platform
    // Handle SEO fields - convert empty strings to null for database
    if (articleData.seo_title !== undefined) updateData.seo_title = articleData.seo_title || null
    if (articleData.seo_description !== undefined) updateData.seo_description = articleData.seo_description || null

    console.log('Updating article with data:', updateData)

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update article error:', error)
      throw error
    }
    
    console.log('Article updated successfully:', data)
    
    // Revalidate articles list and specific article
    mutate(key => typeof key === 'string' && key.startsWith('articles'))
    mutate(`article-${id}`)
    
    return data
  }

  const deleteArticle = async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    // Revalidate articles list
    mutate(key => typeof key === 'string' && key.startsWith('articles'))
  }

  return {
    createArticle,
    updateArticle,
    deleteArticle
  }
}
