import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import pulledPorkImg from "@/assets/pulled-pork.jpg";
import steakImg from "@/assets/steak.jpg";

const B2B = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: "pulled-pork",
      name: "Pulled Pork",
      description: "Spalla di maiale cotta lentamente per 12 ore, tenera e succosa. Perfetta per burger e panini gourmet.",
      image: pulledPorkImg,
    },
    {
      id: "brisket",
      name: "Brisket",
      description: "Petto di manzo affumicato con legno di quercia, dalla crosticina croccante e interno morbidissimo.",
      image: steakImg,
    },
    {
      id: "ribs",
      name: "Baby Back Ribs",
      description: "Costine di maiale glassate con BBQ sauce speciale, cottura lenta per massima morbidezza.",
      image: pulledPorkImg,
    },
    {
      id: "steak",
      name: "Ribeye Steak",
      description: "Taglio pregiato di manzo con marezzatura perfetta, ideale per grigliata o cottura in padella.",
      image: steakImg,
    },
    {
      id: "burger-patties",
      name: "Hamburger Patties",
      description: "Medaglioni di carne di manzo premium, macinatura artigianale, perfetti per burger gourmet.",
      image: steakImg,
    },
  ];

  const handleProductClick = (productId: string) => {
    navigate(`/prenotazioni?product=${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Fornitura B2B</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Carni premium selezionate per ristoranti e attività commerciali.
              Scegli il prodotto e richiedi una fornitura personalizzata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <Card 
                key={product.id}
                className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary font-semibold">
                    Clicca per richiedere una fornitura →
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

export default B2B;
