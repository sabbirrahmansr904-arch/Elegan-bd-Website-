import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("elegan.db");

// Initialize database
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  // Mock Products API
  const products = [
    {
      id: 1,
      name: "Man's Formal Pant - Cream",
      price: 1050,
      originalPrice: 1400,
      image: "https://i.imgur.com/k0ZGqdb.jpeg",
      images: [
        "https://i.imgur.com/k0ZGqdb.jpeg"
      ],
      fabric: "Woven Cotton",
      fit: "Slim Fit",
      description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
      sizes: [30, 32, 34, 36, 38],
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Man's Formal Pant - Black",
      price: 1050,
      originalPrice: 1400,
      image: "https://i.imgur.com/HRM9Abj.jpeg",
      images: [
        "https://i.imgur.com/HRM9Abj.jpeg"
      ],
      fabric: "Woven Cotton",
      fit: "Regular Fit",
      description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
      sizes: [30, 32, 34, 36, 38],
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Man's Formal Pant - Light Ash",
      price: 1050,
      originalPrice: 1400,
      image: "https://i.imgur.com/CHMzGLP.jpeg",
      images: [
        "https://i.imgur.com/CHMzGLP.jpeg"
      ],
      fabric: "Woven Cotton",
      fit: "Slim Fit",
      description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
      sizes: [30, 32, 34, 36, 38],
      rating: 4.7,
      reviews: 210
    },
    {
      id: 4,
      name: "Man's Formal Pant - Dark Navy Blue",
      price: 1050,
      originalPrice: 1400,
      image: "https://i.imgur.com/yJ1rBRX.jpeg",
      images: [
        "https://i.imgur.com/yJ1rBRX.jpeg"
      ],
      fabric: "Woven Cotton",
      fit: "Tapered Fit",
      description: "* Premium-quality Woven Cotton Blended with 2% Spandex\n\n* Tailored straight fit\n\n* Flat front with sharp creases \n\n* Comfortable, breathable, and durable\n\n* Ideal for office, business, and formal wear",
      sizes: [30, 32, 34, 36, 38],
      rating: 4.6,
      reviews: 56
    }
  ];

  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { customerName, phone, address, totalAmount, items } = req.body;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO orders (customer_name, phone, address, total_amount, items)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(customerName, phone, address, totalAmount, JSON.stringify(items));
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
  });
}

startServer();
