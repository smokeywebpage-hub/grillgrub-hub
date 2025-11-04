import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SiteImage {
  id: string;
  key: string;
  url: string;
  alt_text: string | null;
  section: string;
  description: string | null;
}

export const AdminImages = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    url: '',
    alt_text: '',
    section: '',
    description: ''
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .order('section', { ascending: true });

    if (error) {
      toast.error('Errore nel caricamento delle immagini');
    } else {
      setImages(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageData = {
      key: formData.key,
      url: formData.url,
      alt_text: formData.alt_text || null,
      section: formData.section,
      description: formData.description || null
    };

    if (editingImage) {
      const { error } = await supabase
        .from('site_images')
        .update(imageData)
        .eq('id', editingImage.id);

      if (error) {
        toast.error('Errore nell\'aggiornamento');
      } else {
        toast.success('Immagine aggiornata con successo');
        resetForm();
        fetchImages();
      }
    } else {
      const { error } = await supabase
        .from('site_images')
        .insert(imageData);

      if (error) {
        toast.error('Errore nella creazione');
      } else {
        toast.success('Immagine creata con successo');
        resetForm();
        fetchImages();
      }
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa immagine?')) return;

    const { error } = await supabase
      .from('site_images')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'eliminazione');
    } else {
      toast.success('Immagine eliminata');
      fetchImages();
    }
  };

  const editImage = (image: SiteImage) => {
    setEditingImage(image);
    setFormData({
      key: image.key,
      url: image.url,
      alt_text: image.alt_text || '',
      section: image.section,
      description: image.description || ''
    });
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      key: '',
      url: '',
      alt_text: '',
      section: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingImage ? 'Modifica Immagine' : 'Aggiungi Nuova Immagine'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Chiave (identificatore unico)</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="es: hero_image"
                  required
                  disabled={!!editingImage}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section">Sezione</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="es: homepage, menu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL Immagine</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt_text">Testo alternativo</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Descrizione dell'immagine"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione (opzionale)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrizione"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingImage ? 'Aggiorna' : 'Aggiungi'}
              </Button>
              {editingImage && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annulla
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <img 
                  src={image.url} 
                  alt={image.alt_text || image.key} 
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="space-y-1">
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{image.key}</span>
                  <p className="text-xs text-muted-foreground">Sezione: {image.section}</p>
                  {image.description && <p className="text-xs">{image.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => editImage(image)}>Modifica</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteImage(image.id)}>Elimina</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
