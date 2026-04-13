export type Property = {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  type: "rent" | "rent-to-own";
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  images: string[];
  features: string[];
  available: boolean;
  rating: number;
  reviews: number;
  description?: string;
  propertyValue?: number;
  equityRate?: number;
};

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern 3BR Apartment",
    location: "Kilimani, Nairobi",
    neighborhood: "Kilimani",
    price: 85000,
    type: "rent-to-own",
    bedrooms: 3,
    bathrooms: 2,
    size: 1400,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    features: ["Gym", "Swimming Pool", "Parking", "24/7 Security", "Backup Generator"],
    available: true,
    rating: 4.8,
    reviews: 24,
    propertyValue: 18500000,
    equityRate: 15,
  },
  {
    id: "2",
    title: "Cozy 2BR Apartment",
    location: "Westlands, Nairobi",
    neighborhood: "Westlands",
    price: 65000,
    type: "rent",
    bedrooms: 2,
    bathrooms: 2,
    size: 950,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    features: ["Rooftop Terrace", "High-Speed WiFi", "Modern Kitchen", "Parking"],
    available: true,
    rating: 4.6,
    reviews: 18,
  },
  {
    id: "3",
    title: "Spacious 4BR Villa",
    location: "Karen, Nairobi",
    neighborhood: "Karen",
    price: 150000,
    type: "rent-to-own",
    bedrooms: 4,
    bathrooms: 3,
    size: 2800,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80",
    ],
    features: ["Private Garden", "Guest House", "Staff Quarters", "3-Car Garage", "Solar Power"],
    available: true,
    rating: 4.9,
    reviews: 31,
    propertyValue: 45000000,
    equityRate: 20,
  },
  {
    id: "4",
    title: "Studio Apartment",
    location: "Lavington, Nairobi",
    neighborhood: "Lavington",
    price: 28000,
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    size: 450,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    features: ["Fully Furnished", "Water Included", "Internet Ready", "Secure Parking"],
    available: true,
    rating: 4.3,
    reviews: 12,
  },
  {
    id: "5",
    title: "Luxury 2BR Penthouse",
    location: "Kileleshwa, Nairobi",
    neighborhood: "Kileleshwa",
    price: 120000,
    type: "rent-to-own",
    bedrooms: 2,
    bathrooms: 2,
    size: 1600,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    features: ["City Views", "Rooftop Pool", "Concierge", "EV Charging", "Smart Home"],
    available: false,
    rating: 4.9,
    reviews: 8,
    propertyValue: 35000000,
    equityRate: 18,
  },
  {
    id: "6",
    title: "3BR Townhouse",
    location: "Parklands, Nairobi",
    neighborhood: "Parklands",
    price: 75000,
    type: "rent",
    bedrooms: 3,
    bathrooms: 2,
    size: 1800,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    ],
    features: ["Private Garden", "2-Car Garage", "Study Room", "Servant Quarters"],
    available: true,
    rating: 4.5,
    reviews: 15,
    description: "Spacious 3-bedroom townhouse in the serene Parklands neighbourhood. Features a private garden, dedicated study room, and servant quarters. Walking distance to major shopping centres, schools, and public transport.",
  },
  {
    id: "7",
    title: "Riverside Studio",
    location: "Riverside, Nairobi",
    neighborhood: "Riverside",
    price: 29000,
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    size: 450,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    features: ["Fully Furnished", "Fast WiFi", "Water Included", "24/7 Security", "Modern Kitchen", "Secure Parking"],
    available: true,
    rating: 4.4,
    reviews: 9,
    description: "Compact yet stylish studio apartment along Riverside Drive. Ideal for young professionals. Fully furnished with modern amenities and excellent security.",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Amara Ochieng",
    role: "Teacher, Westlands",
    avatar: "AO",
    text: "Rentmo helped me track my credit score and secure a rent loan when I needed it most. The rent-to-own program is a game changer for people like me who thought homeownership was a dream.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Kamau",
    role: "Software Engineer, Kilimani",
    avatar: "JK",
    text: "I've been renting for 5 years and never knew my payments could build credit. Now I'm 30% of the way to owning my apartment through the rent-to-own program. Incredible!",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Ali",
    role: "Entrepreneur, Karen",
    avatar: "FA",
    text: "As a landlord, Rentmo has made managing my 3 properties so much easier. Automated rent collection, tenant screening, and instant payment alerts. 10/10!",
    rating: 5,
  },
];

export const stats = [
  { label: "Properties Listed", value: "2,400+", icon: "🏠" },
  { label: "Happy Tenants", value: "8,500+", icon: "😊" },
  { label: "Rent Paid On Time", value: "94%", icon: "✅" },
  { label: "Avg. Credit Growth", value: "+127pts", icon: "📈" },
];
