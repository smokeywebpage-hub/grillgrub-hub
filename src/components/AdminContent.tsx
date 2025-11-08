import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Edit, Save, X, Image, Type } from 'lucide-react';

interface SiteContent {
  id: string;
  key: string;
  value: string;
  section: string;
  description?: string;
}

interface SiteImage {
  id: string;
  key: string;
  url: string;
  alt_text?: string;
  section: string;
  description?: string;
}

export const AdminContent = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState<'text' | 'image' | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const [showNewTextForm, setShowNewTextForm] = useState(false);
  const [showNewImageForm, setShowNewImageForm] = useState(false);
  const [newText, setNewText] = useState({
    key: '',
    section: '',
    value: '',
    description: '',
  });
  const [newImage, setNewImage] = useState({
    key: '',
    section: '',
    url: '',
    alt_text: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [contentsRes, imagesRes] = await Promise.all([
      supabase.from('site_content').select('*').order('section', { ascending: true }).order('key', { ascending: true }),
      supabase.from('site_images').select('*').order('section', { ascending: true }).order('key', { ascending: true })
    ]);

    if (contentsRes.error) {
      toast.error('Errore nel caricamento dei contenuti');
      return;
    }
    if (imagesRes.error) {
      toast.error('Errore nel caricamento delle immagini');
      return;
    }

    setContents(contentsRes.data || []);
    setImages(imagesRes.data || []);
  };

  const handleEditText = (content: SiteContent) => {
    setEditingId(content.id);
    setEditType('text');
    setEditValues({ [content.id]: content.value });
  };

  const handleEditImage = (image: SiteImage) => {
    setEditingId(image.id);
    setEditType('image');
    setEditValues({ [image.id]: { url: image.url, alt_text: image.alt_text || '' } });
  };

  const handleSaveText = async (id: string) => {
    const { error } = await supabase
      .from('site_content')
      .update({ value: editValues[id] })
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
      return;
    }

    toast.success('Testo aggiornato');
    setEditingId(null);
    setEditType(null);
    fetchData();
  };

  const handleSaveImage = async (id: string) => {
    const { error } = await supabase
      .from('site_images')
      .update({ 
        url: editValues[id].url,
        alt_text: editValues[id].alt_text 
      })
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
      return;
    }

    toast.success('Immagine aggiornata');
    setEditingId(null);
    setEditType(null);
    fetchData();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditType(null);
    setEditValues({});
  };

  const handleCreateText = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('site_content').insert([newText]);
    if (error) {
      toast.error('Errore nella creazione');
      return;
    }
    toast.success('Testo creato');
    setNewText({ key: '', section: '', value: '', description: '' });
    setShowNewTextForm(false);
    fetchData();
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('site_images').insert([newImage]);
    if (error) {
      toast.error('Errore nella creazione');
      return;
    }
    toast.success('Immagine creata');
    setNewImage({ key: '', section: '', url: '', alt_text: '', description: '' });
    setShowNewImageForm(false);
    fetchData();
  };

  const allSections = [...new Set([...contents.map(c => c.section), ...images.map(i => i.section)])].sort();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestione Contenuti Sito</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewTextForm(!showNewTextForm)} variant="outline">
            <Type className="w-4 h-4 mr-2" />
            {showNewTextForm ? 'Chiudi' : 'Aggiungi Testo'}
          </Button>
          <Button onClick={() => setShowNewImageForm(!showNewImageForm)}>
            <Image className="w-4 h-4 mr-2" />
            {showNewImageForm ? 'Chiudi' : 'Aggiungi Immagine'}
          </Button>
        </div>
      </div>

      {showNewTextForm && (
        <Card className="p-6 bg-muted">
          <h3 className="text-xl font-bold mb-4">Nuovo Testo</h3>
          <form onSubmit={handleCreateText} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Chiave (es: hero_title)"
                value={newText.key}
                onChange={(e) => setNewText({ ...newText, key: e.target.value })}
                required
              />
              <Input
                placeholder="Pagina (es: homepage, menu, contatti)"
                value={newText.section}
                onChange={(e) => setNewText({ ...newText, section: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="Testo"
              value={newText.value}
              onChange={(e) => setNewText({ ...newText, value: e.target.value })}
              required
              rows={3}
            />
            <Input
              placeholder="Descrizione (opzionale)"
              value={newText.description}
              onChange={(e) => setNewText({ ...newText, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit">Crea</Button>
              <Button type="button" variant="outline" onClick={() => setShowNewTextForm(false)}>
                Annulla
              </Button>
            </div>
          </form>
        </Card>
      )}

      {showNewImageForm && (
        <Card className="p-6 bg-muted">
          <h3 className="text-xl font-bold mb-4">Nuova Immagine</h3>
          <form onSubmit={handleCreateImage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Chiave (es: hero_image)"
                value={newImage.key}
                onChange={(e) => setNewImage({ ...newImage, key: e.target.value })}
                required
              />
              <Input
                placeholder="Pagina (es: homepage, menu, contatti)"
                value={newImage.section}
                onChange={(e) => setNewImage({ ...newImage, section: e.target.value })}
                required
              />
            </div>
            <Input
              placeholder="URL Immagine"
              value={newImage.url}
              onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
              required
            />
            <Input
              placeholder="Testo alternativo"
              value={newImage.alt_text}
              onChange={(e) => setNewImage({ ...newImage, alt_text: e.target.value })}
            />
            <Input
              placeholder="Descrizione (opzionale)"
              value={newImage.description}
              onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit">Crea</Button>
              <Button type="button" variant="outline" onClick={() => setShowNewImageForm(false)}>
                Annulla
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-8">
        {allSections.map((section) => {
          const sectionTexts = contents.filter(c => c.section === section);
          const sectionImages = images.filter(i => i.section === section);
          
          return (
            <Card key={section} className="p-6">
              <h3 className="text-2xl font-bold mb-6 capitalize bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {section}
              </h3>
              
              {sectionTexts.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Testi
                  </h4>
                  <div className="space-y-3">
                    {sectionTexts.map((content) => (
                      <Card key={content.id} className="p-4 bg-card border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm text-primary">{content.key}</span>
                                {content.description && (
                                  <span className="text-xs text-muted-foreground">({content.description})</span>
                                )}
                              </div>
                              
                              {editingId === content.id && editType === 'text' ? (
                                <Textarea
                                  value={editValues[content.id] || content.value}
                                  onChange={(e) => setEditValues({ ...editValues, [content.id]: e.target.value })}
                                  className="mb-2"
                                  rows={4}
                                />
                              ) : (
                                <div className="p-3 bg-muted rounded-md">
                                  <p className="text-sm whitespace-pre-wrap">{content.value}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 justify-end">
                            {editingId === content.id && editType === 'text' ? (
                              <>
                                <Button size="sm" onClick={() => handleSaveText(content.id)}>
                                  <Save className="w-4 h-4 mr-1" />
                                  Salva
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                  <X className="w-4 h-4 mr-1" />
                                  Annulla
                                </Button>
                              </>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleEditText(content)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Modifica
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {sectionImages.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Immagini
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionImages.map((image) => (
                      <Card key={image.id} className="p-4 bg-card border-2 border-border hover:border-primary/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm text-primary">{image.key}</span>
                            {image.description && (
                              <span className="text-xs text-muted-foreground">({image.description})</span>
                            )}
                          </div>
                          
                          {editingId === image.id && editType === 'image' ? (
                            <>
                              <Input
                                placeholder="URL Immagine"
                                value={editValues[image.id]?.url || image.url}
                                onChange={(e) => setEditValues({ 
                                  ...editValues, 
                                  [image.id]: { ...editValues[image.id], url: e.target.value }
                                })}
                                className="mb-2"
                              />
                              <Input
                                placeholder="Testo alternativo"
                                value={editValues[image.id]?.alt_text || image.alt_text || ''}
                                onChange={(e) => setEditValues({ 
                                  ...editValues, 
                                  [image.id]: { ...editValues[image.id], alt_text: e.target.value }
                                })}
                              />
                            </>
                          ) : (
                            <>
                              <img 
                                src={image.url} 
                                alt={image.alt_text || image.key}
                                className="w-full h-40 object-cover rounded-md"
                              />
                              {image.alt_text && (
                                <p className="text-xs text-muted-foreground">Alt: {image.alt_text}</p>
                              )}
                            </>
                          )}
                          
                          <div className="flex gap-2 justify-end">
                            {editingId === image.id && editType === 'image' ? (
                              <>
                                <Button size="sm" onClick={() => handleSaveImage(image.id)}>
                                  <Save className="w-4 h-4 mr-1" />
                                  Salva
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                  <X className="w-4 h-4 mr-1" />
                                  Annulla
                                </Button>
                              </>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleEditImage(image)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Modifica
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {allSections.length === 0 && !showNewTextForm && !showNewImageForm && (
        <Card className="p-12 text-center">
          <p className="text-xl text-muted-foreground mb-4">Nessun contenuto trovato</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => setShowNewTextForm(true)}>Aggiungi Testo</Button>
            <Button onClick={() => setShowNewImageForm(true)}>Aggiungi Immagine</Button>
          </div>
        </Card>
      )}
    </div>
  );
};
