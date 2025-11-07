import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
}

export const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image_url: '',
    available: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(items.map(item => item.category))).sort();
    setCategories(uniqueCategories);
  }, [items]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Errore caricamento:', error);
      toast.error('Errore nel caricamento degli elementi');
      return;
    }

    setItems(data || []);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Errore upload:', error);
      toast.error('Errore caricamento immagine');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.category.trim()) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }

    let imageUrl = formData.image_url;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    const itemData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      description: formData.description.trim() || null,
      image_url: imageUrl || null,
      available: formData.available,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        console.error('Errore aggiornamento:', error);
        toast.error('Errore nell\'aggiornamento');
        return;
      }
      toast.success('Elemento aggiornato con successo');
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert([itemData]);

      if (error) {
        console.error('Errore creazione:', error);
        toast.error('Errore nella creazione');
        return;
      }
      toast.success('Elemento creato con successo');
    }

    resetForm();
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore eliminazione:', error);
      toast.error('Errore nell\'eliminazione');
      return;
    }

    toast.success('Elemento eliminato');
    fetchItems();
  };

  const deleteCategory = async (category: string) => {
    if (!confirm(`Eliminare la categoria "${category}" e tutti i suoi ${items.filter(i => i.category === category).length} elementi?`)) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('category', category);

    if (error) {
      console.error('Errore eliminazione categoria:', error);
      toast.error('Errore nell\'eliminazione della categoria');
      return;
    }

    toast.success('Categoria eliminata');
    fetchItems();
  };

  const editItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description || '',
      image_url: item.image_url || '',
      available: item.available,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      image_url: '',
      available: true,
    });
    setImageFile(null);
  };

  return (
    <div className="space-y-8">
      {/* Form per aggiungere/modificare elementi */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-2xl font-bold mb-6">
          {editingItem ? 'Modifica Elemento' : 'Aggiungi Nuovo Elemento'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome *</label>
              <Input
                placeholder="Es: Classic Burger"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Prezzo (€) *</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Es: 12.50"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Categoria *</label>
            <Input
              list="categories-list"
              placeholder="Seleziona o digita nuova categoria (Es: Hamburger, Carni, Contorni)"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <datalist id="categories-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground mt-1">
              Seleziona una categoria esistente o digita una nuova
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Descrizione</label>
            <Textarea
              placeholder="Descrizione del piatto..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Immagine</label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setFormData({ ...formData, image_url: '' });
                  }
                }}
              />
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  File selezionato: {imageFile.name}
                </p>
              )}
              {!imageFile && (
                <>
                  <p className="text-xs text-muted-foreground">oppure</p>
                  <Input
                    placeholder="URL immagine"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    disabled={!!imageFile}
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, available: checked as boolean })
              }
            />
            <label 
              htmlFor="available" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Disponibile nel menu
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              {editingItem ? 'Aggiorna Elemento' : 'Aggiungi Elemento'}
            </Button>
            {editingItem && (
              <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                Annulla
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Lista elementi raggruppati per categoria */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Elementi del Menu ({items.length})</h2>
        
        {categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Nessun elemento nel menu. Aggiungi il primo elemento!
            </p>
          </Card>
        ) : (
          categories.map((category) => {
            const categoryItems = items.filter(item => item.category === category);
            return (
              <Card key={category} className="p-6 bg-card border-border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {category} ({categoryItems.length})
                  </h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(category)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Elimina Categoria
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-border">
                      {item.image_url && (
                        <div className="w-full h-40 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-primary">€{item.price.toFixed(2)}</p>
                          <p className={`text-sm ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                            {item.available ? '✓ Disponibile' : '✗ Non disponibile'}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => editItem(item)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modifica
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};