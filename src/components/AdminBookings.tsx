import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Booking {
  id: string;
  restaurant_name: string;
  contact_name: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  desired_date: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Errore nel caricamento delle prenotazioni');
      console.error(error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'aggiornamento dello stato');
      console.error(error);
    } else {
      toast.success('Stato aggiornato con successo');
      fetchBookings();
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Errore nell\'eliminazione');
      console.error(error);
    } else {
      toast.success('Prenotazione eliminata');
      fetchBookings();
    }
  };

  if (loading) {
    return <div className="text-center p-8">Caricamento...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestione Prenotazioni B2B</h2>
      
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">Nessuna prenotazione presente</p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ristorante</TableHead>
                <TableHead>Contatto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Prodotto</TableHead>
                <TableHead>Quantità</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.restaurant_name}</TableCell>
                  <TableCell>{booking.contact_name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>{booking.product}</TableCell>
                  <TableCell>{booking.quantity} kg</TableCell>
                  <TableCell>{new Date(booking.desired_date).toLocaleDateString('it-IT')}</TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === 'approved' ? 'default' :
                      booking.status === 'rejected' ? 'destructive' : 'secondary'
                    }>
                      {booking.status === 'pending' ? 'In attesa' :
                       booking.status === 'approved' ? 'Approvata' : 'Rifiutata'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => updateStatus(booking.id, 'approved')}>
                            Approva
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(booking.id, 'rejected')}>
                            Rifiuta
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => deleteBooking(booking.id)}>
                        Elimina
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
