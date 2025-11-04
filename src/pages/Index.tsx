import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, ChefHat, Award } from "lucide-react";
import heroImage from "@/assets/hero-burger.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Grill House
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-foreground mb-8 animate-fade-in">
            L'Arte della Grigliatura
          </p>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
            Hamburger gourmet e carni premium preparate alla perfezione. 
            Un'esperienza culinaria indimenticabile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Link to="/menu">Scopri il Menu</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/prenotazioni">Ordini B2B</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Perché Sceglierci</h2>
            <p className="text-xl text-muted-foreground">
              Eccellenza in ogni boccone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Flame className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Carne di Qualità</h3>
                <p className="text-muted-foreground">
                  Selezioniamo solo le migliori carni da allevamenti certificati, 
                  garantendo freschezza e sapore autentico.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Chef Esperti</h3>
                <p className="text-muted-foreground">
                  I nostri chef hanno anni di esperienza nella grigliatura e 
                  nella preparazione di hamburger gourmet.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Premiati</h3>
                <p className="text-muted-foreground">
                  Riconosciuti come uno dei migliori ristoranti di carne della città 
                  per 3 anni consecutivi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Pronto a Gustare?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Visita il nostro ristorante e scopri il vero sapore della carne grigliata alla perfezione
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link to="/menu">Esplora il Menu Completo</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
