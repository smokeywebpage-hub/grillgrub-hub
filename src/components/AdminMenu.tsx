import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, X } from 'lucide-react';

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
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
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
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    setCategories(uniqueCategories);
  }, [items]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      toast.error('Errore nel caricamento degli elementi');
      return;
    }

    setItems(data || []);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Errore upload immagine:', error);
      toast.error('Errore nel caricamento dell\'immagine');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.image_url;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    const itemData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description || null,
      image_url: imageUrl || null,
      available: formData.available,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        toast.error('Errore nell\'aggiornamento');
        return;
      }
      toast.success('Elemento aggiornato');
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert([itemData]);

      if (error) {
        toast.error('Errore nella creazione');
        return;
      }
      toast.success('Elemento creato');
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
      toast.error('Errore nell\'eliminazione');
      return;
    }

    toast.success('Elemento eliminato');
    fetchItems();
  };

  const deleteCategory = async (category: string) => {
    if (!confirm(`Sei sicuro di voler eliminare la categoria "${category}" e tutti i suoi elementi?`)) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('category', category);

    if (error) {
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

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          {editingItem ? 'Modifica Elemento' : 'Aggiungi Elemento'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Input
              type="number"
              step="0.01"
              placeholder="Prezzo"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <div className="flex gap-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Seleziona categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewCategory(!showNewCategory)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {showNewCategory && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nuova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="button" onClick={addNewCategory}>Aggiungi</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewCategory(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Textarea
            placeholder="Descrizione"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Immagine</label>
            <div className="flex gap-2 items-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
            </div>
            {!imageFile && (
              <Input
                placeholder="Oppure inserisci URL immagine"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            <label htmlFor="available">Disponibile</label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingItem ? 'Aggiorna' : 'Crea'}
            </Button>
            {editingItem && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Annulla
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{category}</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteCategory(category)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Elimina Sezione
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id} className="p-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-lg font-bold text-primary mb-3">€{item.price}</p>
                    <p className="text-sm mb-3">
                      {item.available ? '✓ Disponibile' : '✗ Non disponibile'}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editItem(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
