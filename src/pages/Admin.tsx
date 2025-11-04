import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminBookings } from '@/components/AdminBookings';
import { AdminMenu } from '@/components/AdminMenu';
import { AdminContent } from '@/components/AdminContent';
import { AdminImages } from '@/components/AdminImages';

const Admin = () => {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pannello Amministrazione</h1>
          <Button onClick={handleSignOut} variant="outline">
            Esci
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="content">Contenuti</TabsTrigger>
            <TabsTrigger value="images">Immagini</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="menu">
            <AdminMenu />
          </TabsContent>

          <TabsContent value="content">
            <AdminContent />
          </TabsContent>

          <TabsContent value="images">
            <AdminImages />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
