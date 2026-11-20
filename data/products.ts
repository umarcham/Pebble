// Edit this file to change the store. Images live in /public/products,
// named  <slug>-<colour>.webp  (first colour in each list is the default).
export const store = { name: "Pebble", tagline: "Made slow, worn hard, handed down." };

export type Color = { name: string; hex: string; image: string };
export type Product = { slug: string; name: string; kind: string; price: number; blurb: string; sizes: string[]; colors: Color[] };

const C = { Butter: "#E3AC2D", Rose: "#EDA6AC", Sage: "#81AD6C", Denim: "#6592B8", Cream: "#F1E6C6" };
const col = (slug: string, names: (keyof typeof C)[]): Color[] =>
  names.map((n) => ({ name: n, hex: C[n], image: `/products/${slug}-${n.toLowerCase()}.webp` }));
const kids = ["1–2y", "2–3y", "3–4y", "4–5y", "5–6y"];

export const products: Product[] = [
  { slug: "smock-dress", name: "Smock Dress", kind: "Dress", price: 84, sizes: kids,
    blurb: "A full skirt for twirling and a Peter Pan collar for best. The smocking across the chest is stitched by hand, row by row.",
    colors: col("smock-dress", ["Butter", "Rose", "Sage", "Denim"]) },
  { slug: "pointelle-cardigan", name: "Pointelle Cardigan", kind: "Knitwear", price: 68, sizes: kids,
    blurb: "A chunky open-work knit with wooden buttons. Soft enough for a first winter, sturdy enough for the third child.",
    colors: col("pointelle-cardigan", ["Denim", "Rose", "Sage", "Butter"]) },
  { slug: "cord-dungarees", name: "Cord Dungarees", kind: "Trousers", price: 58, sizes: kids,
    blurb: "Wide-wale corduroy with a roomy front pocket and turn-up hems that let out as they grow.",
    colors: col("cord-dungarees", ["Sage", "Butter", "Denim", "Rose"]) },
  { slug: "pearl-cardigan", name: "Pearl Cardigan", kind: "Knitwear", price: 72, sizes: kids,
    blurb: "Puffed sleeves, a ribbed hem and pearl buttons down the front. Knitted in a washable cotton blend.",
    colors: col("pearl-cardigan", ["Rose", "Denim", "Sage", "Butter"]) },
  { slug: "sun-hat", name: "Scalloped Sun Hat", kind: "Accessories", price: 32, sizes: ["One size"],
    blurb: "A wide, wavy brim with a bow at the band. Crushable cotton that packs flat in a pocket.",
    colors: col("sun-hat", ["Cream"]) },
];
