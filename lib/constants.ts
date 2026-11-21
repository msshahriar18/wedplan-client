import {
  Camera,
  Castle,
  Flower2,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

export type Category = {
  name: string
  tagline: string
  description: string
  icon: LucideIcon
  image: string
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=75`

export const CATEGORIES: Category[] = [
  {
    name: "Photography & Videography",
    tagline: "Moments, kept forever",
    description: "Candid photos, cinematic films and drone shots",
    icon: Camera,
    image: unsplash("photo-1606216794074-735e91aa2c92"),
  },
  {
    name: "Wedding Venues",
    tagline: "The perfect setting",
    description: "Garden lawns, banquet halls and resort venues",
    icon: Castle,
    image: unsplash("photo-1519167758481-83f550bb49b3"),
  },
  {
    name: "Decoration & Florist",
    tagline: "Flowers and lights",
    description: "Stage design, floral arches and table styling",
    icon: Flower2,
    image: unsplash("photo-1478146896981-b80fe463b330"),
  },
  {
    name: "Catering Services",
    tagline: "Food guests remember",
    description: "Traditional menus, buffets and dessert corners",
    icon: UtensilsCrossed,
    image: unsplash("photo-1555244162-803834f70033"),
  },
  {
    name: "Makeup & Styling",
    tagline: "Look your best",
    description: "Bridal makeup, hair styling and draping",
    icon: Sparkles,
    image: unsplash("photo-1487412947147-5cebf100ffc2"),
  },
  {
    name: "Wedding Fashion",
    tagline: "Made for the day",
    description: "Lehengas, sherwanis, gowns and accessories",
    icon: Shirt,
    image: unsplash("photo-1583939003579-730e3918a45a"),
  },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export const categoryHref = (name: string) => `/services?category=${encodeURIComponent(name)}`

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
]

export const FREE_SERVICE_LIMIT = 3
export const PREMIUM_PRICE = 19
