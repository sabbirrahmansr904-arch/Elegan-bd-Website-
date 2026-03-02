import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const db = new Database("elegan.db");

// Initialize database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT,
      phone TEXT,
      address TEXT,
      total_amount REAL,
      items TEXT,
      status TEXT DEFAULT 'pending',
      payment_method TEXT DEFAULT 'COD',
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT DEFAULT 'Formal Pant',
      price REAL,
      original_price REAL,
      image TEXT,
      images TEXT,
      fabric TEXT,
      fit TEXT,
      description TEXT,
      sizes TEXT,
      rating REAL,
      reviews INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT,
      title TEXT,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      discount_type TEXT, -- 'percentage' or 'fixed'
      discount_value REAL,
      min_purchase REAL DEFAULT 0,
      expiry_date DATETIME,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Ensure payment columns exist (for existing databases)
  try {
    db.prepare("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'COD'").run();
  } catch (e) {}
  try {
    db.prepare("ALTER TABLE orders ADD COLUMN transaction_id TEXT").run();
  } catch (e) {}
  
  // Update existing Formal Pant prices to 999
  try {
    db.prepare("UPDATE products SET price = 999 WHERE name LIKE '%Formal Pant%'").run();
  } catch (e) {}

  // Remove specific products as requested
  try {
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Shirt Cream/Off White'").run();
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Pant - Maroon'").run();
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Pant - Coffee Brown'").run();
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Pant - Olive Green'").run();
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Pant - Charcoal Grey'").run();
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Pant - Royal Blue'").run();
    db.prepare("DELETE FROM products WHERE name = 'Man''s Formal Pant - Khaki'").run();
  } catch (e) {}
} catch (err) {
  console.error("Database initialization error:", err);
}

// Seed initial products if table is empty
try {
  const isInitialized = db.prepare("SELECT value FROM settings WHERE key = 'db_initialized'").get() as { value: string } | undefined;
  
  if (!isInitialized) {
    const initialProducts = [
      {
        name: "Man's Formal Pant - Cream",
        price: 999,
        original_price: 1400,
        image: "https://picsum.photos/seed/elegan1/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan1/800/1000"]),
        fabric: "Woven Cotton",
        fit: "Slim Fit",
        description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
        sizes: JSON.stringify([30, 32, 34, 36, 38]),
        rating: 4.8,
        reviews: 124
      },
      {
        name: "Man's Formal Pant - Black",
        price: 999,
        original_price: 1400,
        image: "https://picsum.photos/seed/elegan2/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan2/800/1000"]),
        fabric: "Woven Cotton",
        fit: "Regular Fit",
        description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
        sizes: JSON.stringify([30, 32, 34, 36, 38]),
        rating: 4.9,
        reviews: 89
      },
      {
        name: "Man's Formal Pant - Light Ash",
        price: 999,
        original_price: 1400,
        image: "https://picsum.photos/seed/elegan3/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan3/800/1000"]),
        fabric: "Woven Cotton",
        fit: "Slim Fit",
        description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
        sizes: JSON.stringify([30, 32, 34, 36, 38]),
        rating: 4.7,
        reviews: 210
      },
      {
        name: "Man's Formal Pant - Dark Navy Blue",
        price: 999,
        original_price: 1400,
        image: "https://picsum.photos/seed/elegan4/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan4/800/1000"]),
        fabric: "Woven Cotton",
        fit: "Tapered Fit",
        description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
        sizes: JSON.stringify([30, 32, 34, 36, 38]),
        rating: 4.6,
        reviews: 56
      },
      {
        name: "Man's Formal Shirt Sky Blue",
        price: 699,
        original_price: 999,
        image: "https://picsum.photos/seed/elegan-shirt-sky/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan-shirt-sky/800/1000"]),
        fabric: "Premium Cotton",
        fit: "Slim Fit",
        description: "* High-quality Premium Cotton\n\n* Breathable and soft texture\n\n* Perfect for formal and semi-formal occasions",
        sizes: JSON.stringify([38, 40, 42, 44]),
        rating: 4.9,
        reviews: 45,
        category: "Formal Shirt - Premium"
      },
      {
        name: "Man's Formal Shirt Black",
        price: 699,
        original_price: 999,
        image: "https://picsum.photos/seed/elegan-shirt-black/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan-shirt-black/800/1000"]),
        fabric: "Premium Cotton",
        fit: "Slim Fit",
        description: "* High-quality Premium Cotton\n\n* Breathable and soft texture\n\n* Perfect for formal and semi-formal occasions",
        sizes: JSON.stringify([38, 40, 42, 44]),
        rating: 4.8,
        reviews: 32,
        category: "Formal Shirt - Premium"
      },
      {
        name: "Man's Formal Shirt White",
        price: 699,
        original_price: 999,
        image: "https://picsum.photos/seed/elegan-shirt-white/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan-shirt-white/800/1000"]),
        fabric: "Premium Cotton",
        fit: "Slim Fit",
        description: "* High-quality Premium Cotton\n\n* Breathable and soft texture\n\n* Perfect for formal and semi-formal occasions",
        sizes: JSON.stringify([38, 40, 42, 44]),
        rating: 4.9,
        reviews: 67,
        category: "Formal Shirt - Premium"
      },
      {
        name: "Man's Formal Shirt Baby Pink",
        price: 699,
        original_price: 999,
        image: "https://picsum.photos/seed/elegan-shirt-pink/800/1000",
        images: JSON.stringify(["https://picsum.photos/seed/elegan-shirt-pink/800/1000"]),
        fabric: "Premium Cotton",
        fit: "Slim Fit",
        description: "* High-quality Premium Cotton\n\n* Breathable and soft texture\n\n* Perfect for formal and semi-formal occasions",
        sizes: JSON.stringify([38, 40, 42, 44]),
        rating: 4.7,
        reviews: 21,
        category: "Formal Shirt - Premium"
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO products (name, price, original_price, image, images, fabric, fit, description, sizes, rating, reviews, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    initialProducts.forEach(p => {
      insertStmt.run(p.name, p.price, p.original_price, p.image, p.images, p.fabric, p.fit, p.description, p.sizes, p.rating, p.reviews, p.category || 'Formal Pant');
    });

    // Seed initial banner
    db.prepare("INSERT OR IGNORE INTO banners (image, title, link) VALUES (?, ?, ?)").run(
      "https://picsum.photos/seed/elegan-banner/1536/1024",
      "Special Offer",
      "/shop"
    );

    // Mark as initialized
    db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run('db_initialized', 'true');
    db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run('promo_image_hero', 'https://i.postimg.cc/s1sTDysL/banner.jpg');
  }

  // Freeze images migration: Convert placeholder URLs to permanent Base64
  const freezeImages = async () => {
    try {
      const products = db.prepare("SELECT id, image, images FROM products WHERE image LIKE 'http%'").all() as any[];
      for (const p of products) {
        try {
          console.log(`Freezing image for product: ${p.id}`);
          const response = await axios.get(p.image, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');
          
          const optimizedBuffer = await sharp(buffer)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer();
          
          const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
          
          // Update main image and the images array
          db.prepare("UPDATE products SET image = ?, images = ? WHERE id = ?").run(
            base64Image,
            JSON.stringify([base64Image]),
            p.id
          );
          console.log(`Successfully froze image for product: ${p.id}`);
        } catch (err) {
          console.error(`Failed to freeze image for product ${p.id}:`, err.message);
        }
      }
      
      // Also freeze banners
      const banners = db.prepare("SELECT id, image FROM banners WHERE image LIKE 'http%'").all() as any[];
      for (const b of banners) {
        try {
          const response = await axios.get(b.image, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');
          const optimizedBuffer = await sharp(buffer)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer();
          const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
          db.prepare("UPDATE banners SET image = ? WHERE id = ?").run(base64Image, b.id);
        } catch (err) {
          console.error(`Failed to freeze banner ${b.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error("Image freezing error:", err);
    }
  };

  freezeImages();

  // Migration: Update formal shirt prices if they are old values
  db.prepare("UPDATE products SET price = 699, original_price = 999 WHERE category LIKE 'Formal Shirt%' AND price > 699").run();

  // Migration: Update formal pant prices to 1049
  db.prepare("UPDATE products SET price = 1049 WHERE category = 'Formal Pant'").run();

  // Ensure promo_image_hero setting exists
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run('promo_image_hero', 'https://i.postimg.cc/s1sTDysL/banner.jpg');

  // Migration: Ensure 4 formal pants exist
  const pantCount = db.prepare("SELECT COUNT(*) as count FROM products WHERE category = 'Formal Pant'").get() as { count: number };
  if (pantCount.count < 4) {
    const pantsNeeded = 4 - pantCount.count;
    const allPants = [
      { name: "Man's Formal Pant - Cream", image: "https://picsum.photos/seed/elegan1/800/1000" },
      { name: "Man's Formal Pant - Black", image: "https://picsum.photos/seed/elegan2/800/1000" },
      { name: "Man's Formal Pant - Light Ash", image: "https://picsum.photos/seed/elegan3/800/1000" },
      { name: "Man's Formal Pant - Dark Navy Blue", image: "https://picsum.photos/seed/elegan4/800/1000" }
    ];

    const insertPant = db.prepare(`
      INSERT OR IGNORE INTO products (name, price, original_price, image, images, fabric, fit, description, sizes, rating, reviews, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    allPants.forEach(p => {
      // Check if this specific pant exists by name
      const exists = db.prepare("SELECT id FROM products WHERE name = ?").get(p.name);
      if (!exists) {
        insertPant.run(
          p.name, 1049, 1400, p.image, JSON.stringify([p.image]), 
          "Woven Cotton", "Slim Fit", 
          "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
          JSON.stringify([30, 32, 34, 36, 38]), 4.8, 50, "Formal Pant"
        );
      }
    });
  }

} catch (err) {
  console.error("Database seeding error:", err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  app.use("/uploads", express.static(uploadDir));

  // Settings API
  app.get("/api/settings/:key", (req, res) => {
    const { key } = req.params;
    const setting = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
    res.json(setting || { value: "" });
  });

  app.post("/api/admin/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ status: "ok" });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
  });

  // Auth API
  app.post("/api/register", (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO users (name, email, password, phone, address)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, email, password, phone, address);
      res.json({ success: true, userId: result.lastInsertRowid });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Products API
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
      res.json(products.map((p: any) => ({
        ...p,
        originalPrice: p.original_price,
        images: JSON.parse(p.images),
        sizes: JSON.parse(p.sizes)
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Customers API
  app.get("/api/customers", (req, res) => {
    try {
      const customers = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Coupons API
  app.get("/api/coupons", (req, res) => {
    try {
      const coupons = db.prepare("SELECT * FROM coupons ORDER BY created_at DESC").all();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  });

  app.post("/api/coupons", (req, res) => {
    const { code, discount_type, discount_value, min_purchase, expiry_date } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO coupons (code, discount_type, discount_value, min_purchase, expiry_date)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(code, discount_type, discount_value, min_purchase, expiry_date);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to create coupon" });
    }
  });

  app.delete("/api/coupons/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM coupons WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete coupon" });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    try {
      const product: any = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
      if (product) {
        res.json({
          ...product,
          originalPrice: product.original_price,
          images: JSON.parse(product.images),
          sizes: JSON.parse(product.sizes)
        });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { customerName, phone, address, totalAmount, items, paymentMethod, transactionId } = req.body;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO orders (customer_name, phone, address, total_amount, items, payment_method, transaction_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(customerName, phone, address, totalAmount, JSON.stringify(items), paymentMethod || 'COD', transactionId || null);
      res.json({ success: true, orderId: result.lastInsertRowid });
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // Admin APIs
  app.get("/api/admin/orders", (req, res) => {
    try {
      const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
      res.json(orders.map((o: any) => ({ ...o, items: JSON.parse(o.items) })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Admin Product Management
  app.post("/api/admin/products", (req, res) => {
    const { name, category, price, originalPrice, image, images, fabric, fit, description, sizes } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO products (name, category, price, original_price, image, images, fabric, fit, description, sizes, rating, reviews)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, category || 'Formal Pant', price, originalPrice, image, JSON.stringify(images), fabric, fit, description, JSON.stringify(sizes), 5.0, 0);
      res.json({ success: true, productId: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.put("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, category, price, originalPrice, image, images, fabric, fit, description, sizes } = req.body;
    try {
      db.prepare(`
        UPDATE products 
        SET name = ?, category = ?, price = ?, original_price = ?, image = ?, images = ?, fabric = ?, fit = ?, description = ?, sizes = ?
        WHERE id = ?
      `).run(name, category, price, originalPrice, image, JSON.stringify(images), fabric, fit, description, JSON.stringify(sizes), id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Banner Management
  app.get("/api/banners", (req, res) => {
    try {
      const banners = db.prepare("SELECT * FROM banners ORDER BY created_at DESC").all();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", (req, res) => {
    const { image, title, link } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO banners (image, title, link) VALUES (?, ?, ?)");
      const result = stmt.run(image, title || "", link || "");
      res.json({ success: true, bannerId: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to add banner" });
    }
  });

  app.delete("/api/admin/banners/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM banners WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete banner" });
    }
  });

  app.post("/api/admin/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Convert image to optimized base64 for permanent database storage
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

      const base64Image = optimizedBuffer.toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
