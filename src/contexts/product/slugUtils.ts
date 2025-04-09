
import { supabase } from '@/lib/supabase';

export const isSlugUnique = async (slug: string, currentProductId?: number): Promise<boolean> => {
  try {
    let query = supabase
      .from('products')
      .select('id')
      .eq('slug', slug);
    
    // If we're checking for an existing product, exclude it from the query
    if (currentProductId) {
      query = query.neq('id', currentProductId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // If no products with this slug were found (or only the current product has it),
    // then the slug is unique
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error checking slug uniqueness:', error);
    return false;
  }
};

export const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
  // First, try the base slug
  if (await isSlugUnique(baseSlug)) {
    return baseSlug;
  }
  
  // If the base slug is not unique, append numbers until we find a unique one
  let count = 1;
  let newSlug = `${baseSlug}-${count}`;
  
  while (!(await isSlugUnique(newSlug))) {
    count++;
    newSlug = `${baseSlug}-${count}`;
    
    // Safety check to prevent infinite loops
    if (count > 100) {
      throw new Error('Could not generate a unique slug after 100 attempts');
    }
  }
  
  return newSlug;
};
