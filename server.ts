import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Local JSON database file path
const DB_FILE = path.join(process.cwd(), "db.json");

// Default dataset for products, articles, and orders
const defaultProducts = [
  {
    id: "cet-oily-skin-cleanser",
    name: "Cetaphil Oily Skin Cleanser (125ml)",
    category: "cleanser",
    skinConcern: ["Oily Skin", "Acne-Prone", "Sensitive Skin"],
    ingredients: ["Niacinamide (Vitamin B3)", "Panthenol (Pro-Vitamin B5)", "Hydrating Glycerin"],
    fullIngredients: "Water, Glycerin, PEG-200 Hydrogenated Glyceryl Palmate, Butylene Glycol, Panthenol, Niacinamide, PEG-7 Glyceryl Cocoate, Sodium Laureth Sulfate, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Sodium Benzoate, Masking Fragrance, Disodium EDTA.",
    price: 4800,
    stock: 120,
    rating: 5.0,
    reviewsCount: 5,
    description: "Cetaphil Oily Skin Cleanser is specifically formulated for individuals dealing with oily, combination, or acne-prone skin. Enriched with a dermatologist-backed blend of Niacinamide (Vitamin B3), Panthenol (Pro-Vitamin B5), and hydrating Glycerin, this face wash strengthens the skin barrier while preserving its natural moisture. Its non-comedogenic, soap-free, and hypoallergenic formula transforms from a low-lather gel into a soft foam to deep-cleanse pores, eliminate excess sebum, and reduce the appearance of enlarged pores. Clinically tested to defend against the five signs of skin sensitivity (dryness, irritation, roughness, tightness, and a weakened skin barrier), it leaves the skin feeling clean, fresh, balanced, and completely residue-free. It is ideal for daily morning and evening use.",
    benefits: [
      "Clinically proven to deep clean pores and remove 99% of excess oil, dirt, and makeup",
      "Formulated with a dermatologist-backed blend of Niacinamide (B3), Panthenol (B5) and Glycerin",
      "Defends against the 5 signs of skin sensitivity including tightness, dryness and irritation",
      "Hypoallergenic, soap-free, non-comedogenic and pH-balanced formula"
    ],
    usage: "Massage a small amount onto wet skin morning and night. Rinse thoroughly with lukewarm water. Pat dry with a clean towel.",
    image: "https://i.imgur.com/QexihB2.png",
    images: [
      "https://i.imgur.com/QexihB2.png",
      "https://i.imgur.com/iVPPYxM.png"
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Kavindi de Silva",
        rating: 5,
        comment: "Godak hoda product ekak. සති දෙකක් විතර පාවිච්චි කරද්දි ලොකු වෙනසක් පෙනුනා. Face එක fresh පිට තියෙනවා දවසම.",
        date: "2026-06-20",
        verified: true
      },
      {
        id: "rev-2",
        author: "Nishantha Silva",
        rating: 5,
        comment: "Oily skin එකට ගොඩක් හොඳයි. මූණ සෝදපුවාම තෙල් ගතිය සේරම නැති වෙනවා ඒත් මූණ වේලෙන්නේ (dry) නෑ. Pimples එන එකත් ගොඩක් අඩු වුනා. Highly recommended!",
        date: "2026-06-18",
        verified: true
      },
      {
        id: "rev-3",
        author: "Anusha Kumari",
        rating: 5,
        comment: "Hama tissema oil gathiya thibbe. Meka use karala duka nathi una. Face wash ekak widiyatama hodama ekak.",
        date: "2026-06-25",
        verified: true
      },
      {
        id: "rev-4",
        author: "Priyantha Ranasinghe",
        rating: 5,
        comment: "Dermatologist recommend kala oily skin ekata. Godak hodayi, skin sensitive ayaat use karanna puluwan.",
        date: "2026-06-29",
        verified: true
      },
      {
        id: "rev-5",
        author: "Thisara Perera",
        rating: 5,
        comment: "Best cleanser for acne prone skin. Clear pores very well! Highly recommended.",
        date: "2026-07-02",
        verified: true
      }
    ],
    tag: "Bestseller",
    metaTitle: "Cetaphil Oily Skin Cleanser (125ml) - Derm-Approved wash",
    metaDescription: "Dermatologist-recommended gel to foam cleanser. Removes 99% excess oil and deep cleans oily or acne prone skin without stripping moisture.",
    seoUrl: "cetaphil-oily-skin-cleanser-125ml"
  }
];

const defaultArticles = [
  {
    id: "art-1",
    title: "How to Build a Routine for Sensitive Skin",
    excerpt: "Navigating active ingredients can be tricky when your barrier is compromised. Learn the essential steps for soothing and repairing.",
    content: `When your skin’s barrier is compromised, typical clinical actives like Retinol or strong acids can trigger inflammation, redness, and micro-cracks. To successfully manage sensitive skin, you must adopt a protective and reparative framework.

### 1. Simplify the Routine
Stick to a minimalistic three-step system: a pH-balanced non-foaming cleanser, a multi-lipid barrier repair cream, and a physical SPF (Zinc Oxide) in the morning. Forgo all chemical peels and mechanical scrubs.

### 2. Prioritize Barrier-Mimicking Lipids
Look for creams that contain Ceramides, Cholesterol, and Free Fatty Acids. When delivered in a physiological 3:1:1:1 ratio, these ingredients actively slide into the gaps of your stratum corneum, creating a physical shield that holds in moisture.

### 3. Introduce Actives Carefully
Only introduce soothing active agents like **Centella Asiatica (Cica)**, **Madecassoside**, or **Allantoin**. These ingredients signal micro-pathways to reduce cytokine production, decreasing redness and warm sensations.

A well-optimized sensitive skincare regimen doesn't overwhelm the skin—it provides the exact nutritional matrix your skin needs to repair itself over a 28-day cellular cycle.`,
    category: "Routines",
    date: "2024-10-12",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    author: "Dr. Sarah Lin, MD (Chief Dermatologist)",
    readTime: "5 min read",
    metaTitle: "Regimen Guide: Building a Routine for Sensitive Skin",
    metaDescription: "Struggling with redness or irritation? Learn our dermatologist-recommended routine to repair compromised barriers using Ceramides and Cica.",
    seoUrl: "build-routine-sensitive-skin"
  },
  {
    id: "art-2",
    title: "The Truth About Hyaluronic Acid Percentages",
    excerpt: "More isn't always better. We break down the clinical data on molecular weights and what your skin actually absorbs.",
    content: `Hyaluronic Acid (HA) has become an essential buzzword in modern cosmetics, with brands advertising ever-higher percentages (up to 10% or 20%). However, clinical dermatology paints a very different picture.

### The Physics of Hyaluronic Acid
Hyaluronic Acid is a humectant that can hold up to 1,000 times its weight in water. In its natural raw form, the HA molecule is extremely large (High Molecular Weight). This molecular structure sits on top of the skin, forming a film that locks in moisture, but it is physically too large to penetrate the epidermis.

To bypass this limit, clinical skincare labs use **Hydrolyzed Hyaluronic Acid** or multi-molecular weight blends. This breaks the HA down into medium and low molecular weights, which can slide past skin junctions.

### Why 2% is the Golden Standard
Studies show that the optimal concentration for topical Hyaluronic Acid is between **1% and 2%**. 

Here is why higher concentrations are not recommended:
1. **The Reverse Moisture Pull**: If a serum has a highly concentrated amount of HA (greater than 4%) in a dry or air-conditioned environment, it will pull moisture *out* of your deeper dermal layers to satisfy its hydration capacity, leaving your skin drier than before.
2. **Skin Irritation**: Unnaturally high densities of ultra-low molecular weight HA can mimic biological warning signals, leading to mild, chronic inflammation.

When shopping for an HA serum, ignore the marketing hype of double-digit percentages. Look for a clean **2% multi-molecular weight formula** supplemented with **Panthenol (Vitamin B5)**, which synergistically aids in water retention.`,
    category: "Ingredients",
    date: "2024-10-05",
    image: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&q=80&w=800",
    author: "Dr. James Carter, PhD (Skincare Biochemist)",
    readTime: "4 min read",
    metaTitle: "The Science of Hyaluronic Acid: Percentages & Weights",
    metaDescription: "Are high Hyaluronic Acid percentages a marketing myth? Discover the biochemical data behind multi-molecular weight formulas and barrier repair.",
    seoUrl: "truth-hyaluronic-acid-percentages"
  },
  {
    id: "art-3",
    title: "Winter SPF: Why It's Non-Negotiable",
    excerpt: "UVA rays remain constant year-round. Discover why daily photo-protection is the foundation of any anti-aging clinical regimen.",
    content: `Many patients believe that once summer ends, sunscreen can be packed away. This is one of the most destructive misconceptions in skincare. UVA rays do not change with the seasons, and they can pass straight through thick winter clouds and standard window glass.

### UVA vs. UVB: The Difference
To understand winter photo-aging, you must distinguish between the two primary bands of ultraviolet radiation:

*   **UVB Rays (Burning)**: These are short-wavelength rays responsible for sunburns and surface-level DNA damage. Their intensity drops drastically during winter and in northern regions.
*   **UVA Rays (Aging)**: These are long-wavelength rays that represent **95%** of all UV radiation reaching the earth. They stay highly consistent throughout the year. 

### UVA and the Dermal Scaffold
UVA penetrates deep into the dermis, where it directly attacks the structural scaffold of your skin: collagen and elastin fibers. It does this by generating **reactive oxygen species (ROS)** that activate collagenase, an enzyme that aggressively eats away at your healthy collagen fibers. This leads to:

1.  Accelerated sagging, fine lines, and deep wrinkles.
2.  Chronic dilation of capillary walls, causing permanent facial redness.
3.  Impaired natural cell repair mechanisms.

### Selecting a Winter Sunscreen
For winter, look for broad-spectrum physical sunscreens formulated with **Zinc Oxide** or highly advanced chemical filters with a **PA++++** rating. Since winter air is dry, look for sunscreens that double as moisturizers, featuring hydrating ingredients like **Niacinamide** and **Squalane**.

Protection is a 365-day commitment. Applying a clinical-grade SPF every morning is the single most effective action you can take to prevent premature aging and preserve skin integrity.`,
    category: "Education",
    date: "2024-09-28",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    author: "Dr. Sarah Lin, MD (Chief Dermatologist)",
    readTime: "6 min read",
    metaTitle: "Winter Sunscreen Guide: Preventing UVA Scaffolding Decay",
    metaDescription: "UVA rays pass through clouds and glass, breaking down collagen. Learn why broad-spectrum SPF 50 is critical 365 days a year for anti-aging.",
    seoUrl: "winter-spf-non-negotiable"
  }
];

const defaultState = {
  products: defaultProducts,
  articles: defaultArticles,
  orders: [
    {
      id: "ord-9843",
      date: "2026-06-25T14:30:00Z",
      items: [
        {
          productId: "prod-1",
          name: "Hyaluronic Acid Hydrating Serum",
          price: 32.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
        },
        {
          productId: "prod-4",
          name: "Ceramide Recovery Cream",
          price: 38.50,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800"
        }
      ],
      subtotal: 70.50,
      shipping: 0.00,
      tax: 5.64,
      total: 76.14,
      status: "Delivered",
      shippingAddress: {
        fullName: "Nervidia Medi",
        email: "nervidiamedi@gmail.com",
        address: "742 Evergreen Terrace",
        city: "Springfield",
        zipCode: "97477"
      },
      paymentMethod: "Credit Card"
    }
  ],
  promoBanner: {
    text: "Free Shipping on orders over $50 | Use code CLINICAL15 for 15% off your first clinical regimen",
    visible: true
  }
};

// Check if database file exists, otherwise write defaults
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
    return defaultState;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db file, resetting to defaults", err);
    return defaultState;
  }
}

function saveDB(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to db file", err);
  }
}

// Initialize database
let db = loadDB();

// Setup Gemini SDK on Server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
} else {
  console.log("No GEMINI_API_KEY found, running in AI simulation mode.");
}

// GET: Entire DB state
app.get("/api/db", (req, res) => {
  db = loadDB();
  res.json(db);
});

// POST: Add or Update a Product
app.post("/api/products", (req, res) => {
  const product = req.body;
  db = loadDB();
  if (!product.id) {
    product.id = "prod-" + Date.now();
    product.rating = 5.0;
    product.reviewsCount = 0;
    db.products.push(product);
  } else {
    const idx = db.products.findIndex((p: any) => p.id === product.id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...product };
    } else {
      db.products.push(product);
    }
  }
  saveDB(db);
  res.json({ success: true, product });
});

// PATCH: Update Product Stock (Inventory Control)
app.patch("/api/products/:id/stock", (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  db = loadDB();
  const idx = db.products.findIndex((p: any) => p.id === id);
  if (idx !== -1) {
    db.products[idx].stock = Number(stock);
    saveDB(db);
    return res.json({ success: true, product: db.products[idx] });
  }
  res.status(404).json({ error: "Product not found" });
});

// POST: Add or Update an Article
app.post("/api/articles", (req, res) => {
  const article = req.body;
  db = loadDB();
  if (!article.id) {
    article.id = "art-" + Date.now();
    article.date = new Date().toISOString().split('T')[0];
    db.articles.push(article);
  } else {
    const idx = db.articles.findIndex((a: any) => a.id === article.id);
    if (idx !== -1) {
      db.articles[idx] = { ...db.articles[idx], ...article };
    } else {
      db.articles.push(article);
    }
  }
  saveDB(db);
  res.json({ success: true, article });
});

// POST: Create a New Order (handles stock deduction)
app.post("/api/orders", (req, res) => {
  const orderDetails = req.body;
  db = loadDB();
  
  // Deduct stocks
  for (const item of orderDetails.items) {
    const pIdx = db.products.findIndex((p: any) => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder = {
    id: "ord-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    items: orderDetails.items,
    subtotal: orderDetails.subtotal,
    shipping: orderDetails.shipping,
    tax: orderDetails.tax,
    total: orderDetails.total,
    status: "Pending",
    shippingAddress: orderDetails.shippingAddress,
    paymentMethod: orderDetails.paymentMethod
  };

  db.orders.unshift(newOrder);
  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// POST: Reorder a past order
app.post("/api/orders/reorder/:id", (req, res) => {
  const { id } = req.params;
  db = loadDB();
  const pastOrder = db.orders.find((o: any) => o.id === id);
  if (!pastOrder) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Verify stock levels and deduct
  for (const item of pastOrder.items) {
    const pIdx = db.products.findIndex((p: any) => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder = {
    ...pastOrder,
    id: "ord-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    status: "Pending"
  };

  db.orders.unshift(newOrder);
  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// POST: Update Promo Banner Settings
app.post("/api/promo", (req, res) => {
  const { text, visible } = req.body;
  db = loadDB();
  db.promoBanner = { text, visible };
  saveDB(db);
  res.json({ success: true, promoBanner: db.promoBanner });
});

// POST: Skin Quiz routine generator via Gemini API
app.post("/api/quiz", async (req, res) => {
  const answers = req.body;
  db = loadDB();

  const productsListStr = db.products
    .map((p: any) => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Core Ingredients: ${p.ingredients.join(", ")}, Target Concerns: ${p.skinConcern.join(", ")}, Benefits: ${p.benefits.join("; ")}`)
    .join("\n");

  const prompt = `You are a clinical dermatologist and cosmetic formulation expert formulating a customized daily medical skincare regimen for a patient with the following skin characteristics:
- Skin Type: ${answers.skinType}
- Main Skin Concern: ${answers.concern}
- Sensitivity Level: ${answers.sensitivity}
- Age Group: ${answers.ageGroup}
- Budget Category: ${answers.budget}

You must select EXACTLY matching products from our clinic's official product list below. DO NOT recommend products not on this list.
Our Official Products:
${productsListStr}

Please generate:
1. A structured step-by-step skincare routine consisting of matching products. Each step must specify step number, product category type, product ID, product Name, and exact dermatologist application instructions.
2. A scientific biochemical explanation of why this routine was constructed for their concerns and sensitivity level.
3. 3 crucial clinical tips for application, sun protection, or active ingredient management.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "routine": [
    {
      "step": 1,
      "type": "cleanser / serum / cream / exfoliant / mask",
      "productId": "id-from-official-list",
      "productName": "Exact Name of the matched product",
      "instructions": "Dermatologist application instructions (e.g. apply in evening, use SPF next day, etc)"
    }
  ],
  "explanation": "Detailed professional explanation...",
  "tips": [
    "Clinical Tip 1",
    "Clinical Tip 2",
    "Clinical Tip 3"
  ]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routine: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    type: { type: Type.STRING },
                    productId: { type: Type.STRING },
                    productName: { type: Type.STRING },
                    instructions: { type: Type.STRING }
                  },
                  required: ["step", "type", "productId", "productName", "instructions"]
                }
              },
              explanation: { type: Type.STRING },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["routine", "explanation", "tips"]
          }
        }
      });

      const resultText = response.text || "{}";
      const resultObj = JSON.parse(resultText);
      return res.json(resultObj);
    } catch (err) {
      console.error("Gemini Quiz Error", err);
      // Fallback to simulated local generation
    }
  }

  // SIMULATED FALLBACK GENERATION (when AI fails or API key is absent)
  console.log("Using simulated quiz matching logic.");
  const matchedProducts = db.products.filter((p: any) => {
    return p.skinConcern.includes(answers.concern) || p.skinConcern.includes("Sensitive Skin");
  });

  const routine: any[] = [];
  let step = 1;

  // Find a cleanser
  const cleanser = db.products.find((p: any) => p.category === "cleanser") || db.products[1];
  routine.push({
    step: step++,
    type: "cleanser",
    productId: cleanser.id,
    productName: cleanser.name,
    instructions: "Apply morning and evening. Wash gently with lukewarm water. Crucial first step to clear pores."
  });

  // Find matching serum
  const serum = matchedProducts.find((p: any) => p.category === "serum") || db.products[0];
  routine.push({
    step: step++,
    type: "serum",
    productId: serum.id,
    productName: serum.name,
    instructions: serum.usage || "Apply a few drops after cleansing, patting gently into the skin."
  });

  // Find cream
  const cream = matchedProducts.find((p: any) => p.category === "cream") || db.products[3];
  routine.push({
    step: step++,
    type: "cream",
    productId: cream.id,
    productName: cream.name,
    instructions: cream.usage || "Apply evenly to lock in active ingredients and defend lipid layers."
  });

  res.json({
    routine,
    explanation: `Based on your skin profile (${answers.skinType}, targeting ${answers.concern} with ${answers.sensitivity} sensitivity), we designed this medical-grade routine. Since your barrier requires delicate care, we avoided excessive acids and introduced ${serum.name} which utilizes key therapeutic components like ${serum.ingredients[0]} to soothe redness, restore epidermal lipids, and elevate overall skin hydration securely.`,
    tips: [
      "Always patch test active serums behind the ear for 24 hours before full facial introduction.",
      "If using Retinol or exfoliating acids, SPF 50 is strictly mandatory the following morning to prevent severe post-inflammatory photo-pigmentation.",
      "Apply hydrating serums to damp skin to maximize water retention and lock in moisture efficiently."
    ]
  });
});

// POST: Skincare AI Consultation Chatbot Advisor
app.post("/api/gemini/advisor", async (req, res) => {
  const { message, history } = req.body;
  db = loadDB();

  const productsListStr = db.products
    .map((p: any) => `- Name: ${p.name}, Category: ${p.category}, Active Ingredients: ${p.ingredients.join(", ")}, Skin Concerns: ${p.skinConcern.join(", ")}, Price: $${p.price}, Target: ${p.description}`)
    .join("\n");

  const systemPrompt = `You are the chief Cetaphil clinical AI skincare consultant, a professional, highly empathetic dermatologist assistant. 
Your goal is to offer objective, science-backed skin counseling, break down advanced ingredients (like ceramides, niacinamide, panthenol, and calendula), and recommend precise products from our clinic's official line-up.

Always maintain a reassuring, authoritative, and helpful medical tone. Keep answers structured, easy to read, using clear markdown lists.
Do NOT mention or recommend any external brands or products outside of our Cetaphil lineup listed here:
${productsListStr}

If the user asks general questions about skin routines or specific ingredients, explain biochemically what they do and suggest the corresponding Cetaphil product.`;

  if (ai) {
    try {
      // Reconstruct chat with history
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemPrompt,
        }
      });

      // Inject history (excluding the final current message)
      if (history && history.length > 0) {
        // Simple mock history loading by iterating messages or constructing a single prompt containing context
      }

      const response = await chat.sendMessage({ message });
      return res.json({ response: response.text });
    } catch (err) {
      console.error("Gemini Advisor Error", err);
    }
  }

  // Fallback simulated response
  const lowerMsg = message.toLowerCase();
  let fallbackReply = "Thank you for consulting the Cetaphil Clinical Advisor. ";
  if (lowerMsg.includes("acne") || lowerMsg.includes("pimple") || lowerMsg.includes("oily")) {
    fallbackReply += "For oily and acne-prone skin, we advise the **Cetaphil Oily Skin Cleanser** to remove excess oil without stripping the moisture barrier, paired with our lightweight moisturizing formulations.";
  } else if (lowerMsg.includes("dry") || lowerMsg.includes("dehydrated") || lowerMsg.includes("flake")) {
    fallbackReply += "Dehydrated skin requires deep, long-lasting barrier repair. We recommend **Cetaphil Moisturizing Cream (Very Dry to Dry Sensitive Skin)** containing Sweet Almond Oil, Niacinamide, and Panthenol for 48-hour hydration defense.";
  } else if (lowerMsg.includes("sensitive") || lowerMsg.includes("red") || lowerMsg.includes("burn")) {
    fallbackReply += "Sensitive or reactive skin requires ultra-gentle, non-irritating care. We recommend the classic **Cetaphil Gentle Skin Cleanser** with Micellar Technology, followed by **Cetaphil Daily Hydrating Lotion** to soothe and calm the epidermis.";
  } else if (lowerMsg.includes("baby") || lowerMsg.includes("infant") || lowerMsg.includes("child")) {
    fallbackReply += "For delicate baby skin, explore our **Cetaphil Baby** range, featuring tear-free **Cetaphil Baby Daily Lotion with Organic Calendula** and **Cetaphil Baby Shampoo** to nourish delicate skin from Day 1.";
  } else {
    fallbackReply += "To establish a clinical routine for your skin, I recommend trying our **Interactive Skin Quiz** located in the top menu! It identifies your skin type and sensitivity triggers to provide recommended Cetaphil formulations.";
  }
  res.json({ response: fallbackReply });
});

// POST: AI Copywriter for CMS
app.post("/api/gemini/generate-description", async (req, res) => {
  const { name, ingredients, concerns } = req.body;

  const prompt = `You are a clinical skincare brand copywriter. Write a highly compelling, professional, dermatologist-aligned e-commerce product description for a product named "${name}" containing key ingredients "${ingredients}" designed specifically to treat "${concerns}".
Your copy must include:
1. An authoritative, elegant 3-sentence introduction describing the product's medical purpose and efficacy.
2. A bulleted list of 3 key scientific benefits (e.g. cellular hydration, sebum regulation, lipid alignment) using advanced medical terminology.
3. Concise "How to Use" instructions.

Keep the output elegant, professional, and do not use generic marketing buzzwords. Just return plain text formatted in standard markdown.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      return res.json({ text: response.text });
    } catch (err) {
      console.error("Gemini CMS Copywriter Error", err);
    }
  }

  // Simulated description fallback
  res.json({
    text: `### Clinical Description
This professional-strength formulation represents an advanced approach to restoring compromised skin architecture. Engineered with clinical-grade **${ingredients}**, it works at a cellular level to target **${concerns}** while strengthening structural skin integrity.

### Key Benefits
- **Optimized Skin Restoration**: Actively delivers therapeutic concentrations to reverse cellular fatigue.
- **Deep Moisture Reinforcement**: Rebuilds protective lipid bilayers, preventing trans-epidermal water loss (TEWL).
- **Targeted Care for ${concerns}**: Gently calms active inflammatory pathways and refines coarse textures.

### Clinical Directions
Apply 2-3 drops to dry, thoroughly cleansed skin in the morning or evening. Pat gently and follow with your recommended barrier repair moisturizer.`
  });
});

// Vite Middleware & Static Serves & Bootstrap
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cetaphil Server is running on port ${PORT}`);
  });
}

bootstrap();
