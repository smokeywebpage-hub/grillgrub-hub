import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import burgerClassic from "@/assets/burger-classic.jpg";
import pulledPork from "@/assets/pulled-pork.jpg";
import steak from "@/assets/steak.jpg";
import fries from "@/assets/fries.jpg";

const Menu = () => {
  const menuCategories = [
    {
      title: "Hamburger",
      items: [
        { name: "Classic Burger", description: "Hamburger classico con lattuga, pomodoro, cipolla", price: "€12.00", image: burgerClassic },
        { name: "Bacon Burger", description: "Con bacon croccante e formaggio cheddar", price: "€14.00", image: burgerClassic },
        { name: "BBQ Burger", description: "Con salsa BBQ, cipolle caramellate e bacon", price: "€15.00", image: burgerClassic },
        { name: "Grill House Special", description: "Doppio hamburger, formaggio, bacon, uova", price: "€18.00", image: burgerClassic },
      ],
    },
    {
      title: "Carni",
      items: [
        { name: "Pulled Pork", description: "Maiale sfilacciato cotto lentamente per 12 ore", price: "€16.00", image: pulledPork },
        { name: "Ribeye Steak", description: "Bistecca di manzo 300g con contorno", price: "€28.00", image: steak },
        { name: "Baby Back Ribs", description: "Costine di maiale con salsa BBQ", price: "€22.00", image: pulledPork },
        { name: "Brisket", description: "Punta di petto affumicata 10 ore", price: "€24.00", image: steak },
      ],
    },
    {
      title: "Contorni",
      items: [
        { name: "Patatine Fritte", description: "Croccanti e dorate", price: "€4.00", image: fries },
        { name: "Onion Rings", description: "Anelli di cipolla impanati", price: "€5.00", image: fries },
        { name: "Coleslaw", description: "Insalata di cavolo e carote", price: "€4.00", image: fries },
        { name: "Mac & Cheese", description: "Pasta al formaggio cremosa", price: "€6.00", image: fries },
      ],
    },
    {
      title: "Bibite",
      items: [
        { name: "Coca Cola", description: "Lattina 33cl", price: "€3.00" },
        { name: "Birra Artigianale", description: "Selezione di birre locali", price: "€5.00" },
        { name: "Acqua", description: "Naturale o frizzante 50cl", price: "€2.00" },
        { name: "Vino della Casa", description: "Rosso o Bianco - calice", price: "€4.50" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Il Nostro Menu</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scopri la nostra selezione di hamburger gourmet e carni premium
            </p>
          </div>

          <div className="space-y-16">
            {menuCategories.map((category, idx) => (
              <section key={idx}>
                <h2 className="text-4xl font-bold mb-8 text-primary">{category.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item, itemIdx) => (
                    <Card key={itemIdx} className="overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {item.image && (
                            <div className="w-full sm:w-32 h-32 flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold">{item.name}</h3>
                              <span className="text-lg font-bold text-primary">{item.price}</span>
                            </div>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
