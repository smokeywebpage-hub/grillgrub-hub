import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Edit, Save, X } from 'lucide-react';

interface SiteContent {
  id: string;
  key: string;
  value: string;
  section: string;
  description?: string;
}

export const AdminContent = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [newContent, setNewContent] = useState({
    key: '',
    section: '',
    value: '',
    description: '',
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      toast.error('Errore nel caricamento dei contenuti');
      return;
    }

    setContents(data || []);
  };

  const handleEdit = (content: SiteContent) => {
    setEditingId(content.id);
    setEditValues({ [content.id]: content.value });
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('site_content')
      .update({ value: editValues[id] })
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'aggiornamento');
      return;
    }

    toast.success('Contenuto aggiornato');
    setEditingId(null);
    fetchContents();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('site_content')
      .insert([newContent]);

    if (error) {
      toast.error('Errore nella creazione');
      return;
    }

    toast.success('Contenuto creato');
    setNewContent({ key: '', section: '', value: '', description: '' });
    setShowNewForm(false);
    fetchContents();
  };

  const groupedContents = contents.reduce((acc, content) => {
    if (!acc[content.section]) {
      acc[content.section] = [];
    }
    acc[content.section].push(content);
    return acc;
  }, {} as { [key: string]: SiteContent[] });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestione Contenuti Sito</h2>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? 'Chiudi Form' : 'Aggiungi Contenuto'}
        </Button>
      </div>

      {showNewForm && (
        <Card className="p-6 bg-muted">
          <h3 className="text-xl font-bold mb-4">Nuovo Contenuto</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Chiave (es: hero_title)"
                value={newContent.key}
                onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                required
              />
              <Input
                placeholder="Sezione (es: homepage)"
                value={newContent.section}
                onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="Valore"
              value={newContent.value}
              onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
              required
              rows={3}
            />
            <Input
              placeholder="Descrizione (opzionale)"
              value={newContent.description}
              onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit">Crea</Button>
              <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                Annulla
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-8">
        {Object.entries(groupedContents).map(([section, items]) => (
          <Card key={section} className="p-6">
            <h3 className="text-2xl font-bold mb-6 capitalize bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {section}
            </h3>
            
            <div className="space-y-4">
              {items.map((content) => (
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
                        
                        {editingId === content.id ? (
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
                      {editingId === content.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(content.id)}>
                            <Save className="w-4 h-4 mr-1" />
                            Salva
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="w-4 h-4 mr-1" />
                            Annulla
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(content)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Modifica
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {Object.keys(groupedContents).length === 0 && !showNewForm && (
        <Card className="p-12 text-center">
          <p className="text-xl text-muted-foreground mb-4">Nessun contenuto trovato</p>
          <Button onClick={() => setShowNewForm(true)}>Aggiungi il primo contenuto</Button>
        </Card>
      )}
    </div>
  );
};
