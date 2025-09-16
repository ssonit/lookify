import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';

export interface VirtualTryOn {
  id: string;
  user_id: string;
  uploaded_image_url: string;
  selected_outfit_id: string;
  result_image_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  // Fields from virtual_try_on_with_details view
  full_name?: string;
  email?: string;
  outfit_title?: string;
  outfit_image?: string;
}

export interface VirtualTryOnResponse {
  virtualTryOns: VirtualTryOn[];
  totalCount: number;
}

export interface VirtualTryOnFilterParams {
  limit?: number;
  offset?: number;
  status?: string;
  user_id?: string;
  search?: string;
  enabled?: boolean;
}

// Fetch all virtual try-on records for a user
export function useVirtualTryOns(params: VirtualTryOnFilterParams = {}) {
  const supabase = createClient();
  const { limit = 10, offset = 0, status, user_id, search, enabled = true } = params;

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `virtual-try-on-${JSON.stringify(params)}` : null,
    async () => {
      let query = supabase
        .from('virtual_try_on_with_details')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status);
      }

      if (user_id) {
        query = query.eq('user_id', user_id);
      }

      if (search && search.trim()) {
        const searchTerm = search.trim()
        query = query.or(`full_name.ilike.%${searchTerm}%,outfit_title.ilike.%${searchTerm}%`);
      }

      if(limit) {
        const start = offset || 0
        const end = start + limit - 1
        query = query.range(start, end)
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching virtual try-on records:', error);
        throw error;
      }

      return {
        virtualTryOns: data || [],
        totalCount: count || 0,
      } as VirtualTryOnResponse;
    }
  );

  return {
    virtualTryOns: data?.virtualTryOns || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    mutate,
  };
}

// Fetch single virtual try-on record
export function useVirtualTryOn(id: string) {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR(
    id ? `virtual-try-on-${id}` : null,
    async () => {
      const { data, error } = await supabase
        .from('virtual_try_on')
        .select(`
          *,
          outfits!virtual_try_on_selected_outfit_id_fkey (
            id,
            title,
            image_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching virtual try-on record:', error);
        throw error;
      }

      return data as VirtualTryOn;
    }
  );

  return {
    virtualTryOn: data,
    isLoading,
    error,
    mutate,
  };
}

// Create new virtual try-on record
export function useCreateVirtualTryOn() {
  const supabase = createClient();

  const createVirtualTryOn = async (data: {
    uploaded_image_url: string;
    selected_outfit_id: string;
    result_image_url?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
  }) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data: result, error } = await supabase
        .from('virtual_try_on')
        .insert({
          user_id: user.id,
          uploaded_image_url: data.uploaded_image_url,
          selected_outfit_id: data.selected_outfit_id,
          result_image_url: data.result_image_url,
          status: data.status || 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating virtual try-on record:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in createVirtualTryOn:', error);
      throw error;
    }
  };

  return { createVirtualTryOn };
}

// Update virtual try-on record
export function useUpdateVirtualTryOn() {
  const supabase = createClient();

  const updateVirtualTryOn = async (
    id: string,
    data: {
      uploaded_image_url?: string;
      result_image_url?: string;
      status?: 'pending' | 'processing' | 'completed' | 'failed';
    }
  ) => {
    try {
      const { data: result, error } = await supabase
        .from('virtual_try_on')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating virtual try-on record:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in updateVirtualTryOn:', error);
      throw error;
    }
  };

  return { updateVirtualTryOn };
}

// Delete virtual try-on record
export function useDeleteVirtualTryOn() {
  const supabase = createClient();

  const deleteVirtualTryOn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('virtual_try_on')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting virtual try-on record:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteVirtualTryOn:', error);
      throw error;
    }
  };

  return { deleteVirtualTryOn };
}
