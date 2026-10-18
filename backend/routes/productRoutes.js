const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/seed - Populate database with initial items (MUST BE ABOVE /:id)
router.get('/seed', async (req, res) => {
    try {
        await Product.deleteMany({});
        const createdProducts = await Product.insertMany([
            {
                title: "Inverter AC Gas Charging & Leakage Repair Doorstep Service",
                category: "Repair Service",
                type: "service",
                price: 1899,
                originalPrice: 2500,
                discount: "24% OFF",
                rating: 4.8,
                reviews: 840,
                image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop",
                badge: "90 Days Service Guarantee",
                desc: "Complete pressure testing, nitrogen leak detection, vacuuming, and R32/R410 gas top-up."
            },
            {
                title: "Samsung 236L 3 Star Double Door Refrigerator (Inverter Compressor)",
                category: "Refrigerator",
                type: "appliance",
                price: 24990,
                originalPrice: 31990,
                discount: "22% OFF",
                rating: 4.7,
                reviews: 320,
                image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop",
                badge: "1 Year Product",
                desc: "Digital Inverter Compressor, convertible freezer modes, toughened glass shelves."
            },
            {
                title: "Copper Pipe 1/4 + 3/8 for 1.5 Ton Split AC (3 Meters Set)",
                category: "AC Spare Parts",
                type: "spare",
                price: 1850,
                originalPrice: 2600,
                discount: "29% OFF",
                rating: 4.8,
                reviews: 43,
                image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop",
                badge: "Direct Replacement",
                desc: "Pure thick-gauge insulated copper tubing for split air conditioner installation."
            },
            {
                title: "Kent/Aquaguard RO Sediment + Carbon Filter Maintenance Kit",
                category: "Water Filter / RO",
                type: "spare",
                price: 799,
                originalPrice: 1499,
                discount: "47% OFF",
                rating: 4.7,
                reviews: 210,
                image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=500&auto=format&fit=crop",
                badge: "Tested Quality",
                desc: "Universal inline sediment filter, carbon block, and post-carbon filter set."
            }
        ]);
        res.json({ message: "Database Seeded Successfully", count: createdProducts.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET product by ID (MUST BE BELOW /seed)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create product (Admin protected)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, desc, price, category, type, image, originalPrice, discount, badge } = req.body;
        const product = new Product({ title, desc, price, category, type, image, originalPrice, discount, badge });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;