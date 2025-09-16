'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

export default function TestSupabaseQueryPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testQuery = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .select(`
          *,
          seasons:season_id(name),
          colors:color_id(name),
          outfit_categories(
            categories:category_id(name)
          ),
          outfit_items(
            id,
            name,
            type,
            image_url,
            affiliate_links
          )
        `)
        .eq('id', '16ca5507-7ab7-4541-b13f-a69ef2453715')
        .eq('is_public', true)
        .single()

      if (outfitError) {
        setError(outfitError.message);
        return;
      }

      setResult(outfit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testQuery();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Supabase Query</h1>
      
      <div className="mb-6">
        <button 
          onClick={testQuery}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Query'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800"><strong>Error:</strong> {error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Outfit Info</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>ID:</strong> {result.id}</p>
              <p><strong>Title:</strong> {result.title}</p>
              <p><strong>Gender:</strong> {result.gender}</p>
              <p><strong>Season:</strong> {result.seasons?.name || 'None'}</p>
              <p><strong>Color:</strong> {result.colors?.name || 'None'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Items ({result.outfit_items?.length || 0})</h2>
            {result.outfit_items && result.outfit_items.length > 0 ? (
              <div className="space-y-3">
                {result.outfit_items.map((item: any, index: number) => (
                  <div key={item.id || index} className="bg-white border rounded-lg p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Type: {item.type}</p>
                    <p className="text-sm text-gray-600">ID: {item.id}</p>
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded mt-2"
                      />
                    )}
                    {item.affiliate_links && item.affiliate_links.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Links:</p>
                        <ul className="text-sm text-gray-600">
                          {item.affiliate_links.map((link: any, linkIndex: number) => (
                            <li key={linkIndex}>
                              {link.store}: {link.url}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">No items found</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
