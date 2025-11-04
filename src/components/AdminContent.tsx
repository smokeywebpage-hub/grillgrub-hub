import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SiteContent {
  id: string;
  key: string;
  value: string;
  section: string;
  description: string | null;
}

export const AdminContent = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    section: '',
    description: ''
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true });

    if (error) {
      toast.error('Errore nel caricamento dei contenuti');
    } else {
      setContents(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contentData = {
      key: formData.key,
      value: formData.value,
      section: formData.section,
      description: formData.description || null
    };

    if (editingContent) {
      const { error } = await supabase
        .from('site_content')
        .update(contentData)
        .eq('id', editingContent.id);

      if (error) {
        toast.error('Errore nell\'aggiornamento');
      } else {
        toast.success('Contenuto aggiornato con successo');
        resetForm();
        fetchContents();
      }
    } else {
      const { error } = await supabase
        .from('site_content')
        .insert(contentData);

      if (error) {
        toast.error('Errore nella creazione');
      } else {
        toast.success('Contenuto creato con successo');
        resetForm();
        fetchContents();
      }
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo contenuto?')) return;

    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'eliminazione');
    } else {
      toast.success('Contenuto eliminato');
      fetchContents();
    }
  };

  const editContent = (content: SiteContent) => {
    setEditingContent(content);
    setFormData({
      key: content.key,
      value: content.value,
      section: content.section,
      description: content.description || ''
    });
  };

  const resetForm = () => {
    setEditingContent(null);
    setFormData({
      key: '',
      value: '',
      section: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingContent ? 'Modifica Contenuto' : 'Aggiungi Nuovo Contenuto'}</CardTitle>
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
                  placeholder="es: hero_title"
                  required
                  disabled={!!editingContent}
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
              <Label htmlFor="value">Contenuto</Label>
              <Textarea
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione (opzionale)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrizione del contenuto"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingContent ? 'Aggiorna' : 'Aggiungi'}
              </Button>
              {editingContent && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annulla
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Contenuti Esistenti</h3>
        {contents.map((content) => (
          <Card key={content.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{content.key}</span>
                    <span className="text-xs text-muted-foreground">Sezione: {content.section}</span>
                  </div>
                  <p className="text-sm">{content.value}</p>
                  {content.description && (
                    <p className="text-xs text-muted-foreground italic">{content.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => editContent(content)}>Modifica</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteContent(content.id)}>Elimina</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
