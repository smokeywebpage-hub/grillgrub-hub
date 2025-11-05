import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

const Prenotazioni = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    restaurantName: "",
    contactName: "",
    email: "",
    phone: "",
    product: "",
    quantity: "",
    date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productParam = searchParams.get('product');
    if (productParam) {
      setFormData(prev => ({ ...prev, product: productParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('bookings').insert({
      restaurant_name: formData.restaurantName,
      contact_name: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      product: formData.product,
      quantity: parseInt(formData.quantity),
      desired_date: formData.date,
      notes: formData.notes || null,
    });

    setLoading(false);

    if (error) {
      toast.error("Errore nell'invio della richiesta. Riprova più tardi.");
      console.error(error);
    } else {
      toast.success("Richiesta inviata con successo! Ti contatteremo presto.");
      setFormData({
        restaurantName: "",
        contactName: "",
        email: "",
        phone: "",
        product: "",
        quantity: "",
        date: "",
        notes: "",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Prenotazioni B2B</h1>
            <p className="text-xl text-muted-foreground">
              Forniamo carni premium per ristoranti e attività commerciali
            </p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Richiesta di Fornitura</CardTitle>
              <CardDescription>
                Compila il form per richiedere una fornitura di carni per il tuo ristorante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Nome Ristorante *</Label>
                    <Input
                      id="restaurantName"
                      placeholder="Es: Trattoria da Mario"
                      value={formData.restaurantName}
                      onChange={(e) => handleChange("restaurantName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Nome Referente *</Label>
                    <Input
                      id="contactName"
                      placeholder="Mario Rossi"
                      value={formData.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@ristorante.it"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+39 123 456 7890"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product">Prodotto *</Label>
                    <Select value={formData.product} onValueChange={(value) => handleChange("product", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona prodotto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pulled-pork">Pulled Pork</SelectItem>
                        <SelectItem value="brisket">Brisket</SelectItem>
                        <SelectItem value="ribs">Baby Back Ribs</SelectItem>
                        <SelectItem value="steak">Ribeye Steak</SelectItem>
                        <SelectItem value="burger-patties">Hamburger Patties</SelectItem>
                        <SelectItem value="altro">Altro (specificare nelle note)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantità (kg) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Es: 10"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="date">Data Consegna Desiderata *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Note Aggiuntive</Label>
                    <Textarea
                      id="notes"
                      placeholder="Eventuali richieste specifiche o informazioni aggiuntive..."
                      className="min-h-32"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-accent" disabled={loading}>
                  {loading ? "Invio in corso..." : "Invia Richiesta"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border text-center">
              <CardHeader>
                <CardTitle>Qualità Premium</CardTitle>
                <CardDescription>
                  Solo le migliori carni selezionate per il tuo business
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardHeader>
                <CardTitle>Consegna Rapida</CardTitle>
                <CardDescription>
                  Consegne puntuali e affidabili in tutta la regione
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardHeader>
                <CardTitle>Prezzi Competitivi</CardTitle>
                <CardDescription>
                  Tariffe vantaggiose per ordini all'ingrosso
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Prenotazioni;
