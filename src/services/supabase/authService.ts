import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type SavedProperty = Database['public']['Tables']['saved_properties']['Row'];

class AuthService {
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getSavedProperties(): Promise<SavedProperty[]> {
    const user = await this.getCurrentUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('saved_properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async saveProperty(property: Database['public']['Tables']['saved_properties']['Insert']): Promise<SavedProperty> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to save properties');
    }

    const { data, error } = await supabase
      .from('saved_properties')
      .insert({ ...property, user_id: user.id })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteSavedProperty(propertyId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to delete properties');
    }

    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
