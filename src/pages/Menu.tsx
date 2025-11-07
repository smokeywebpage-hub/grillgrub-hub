import { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      // Fetch only available items for public menu
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Errore caricamento menu:', error);
        toast.error('Errore nel caricamento del menu');
        return;
      }

      setMenuItems(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set((data || []).map(item => item.category))
      ).sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore nel caricamento del menu');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryItems = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-xl text-muted-foreground">Caricamento menu...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Il Nostro Menu</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scopri la nostra selezione di hamburger gourmet e carni premium
            </p>
          </div>

          {/* Menu Categories */}
          {categories.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-xl text-muted-foreground">
                Il menu è in aggiornamento. Torna presto!
              </p>
            </Card>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => {
                const items = getCategoryItems(category);
                if (items.length === 0) return null;

                return (
                  <section key={category}>
                    <h2 className="text-4xl font-bold mb-8 text-primary">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {items.map((item) => (
                        <Card 
                          key={item.id} 
                          className="overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              {item.image_url && (
                                <div className="w-full sm:w-32 h-32 flex-shrink-0">
                                  <img 
                                    src={item.image_url} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Hide image if it fails to load
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-xl font-semibold">
                                    {item.name}
                                  </h3>
                                  <span className="text-lg font-bold text-primary ml-4">
                                    €{item.price.toFixed(2)}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;