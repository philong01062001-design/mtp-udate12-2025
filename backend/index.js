// server/index.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- DỮ LIỆU MẪU (Đã sửa khớp với Frontend MTP) ---
const products = [
    {
      id: 1,
      title: "Áo Thun MTP Signature",  // Vue cần 'title', không phải 'name'
      thumbnail: "https://i.imgur.com/s5Whh5c.jpeg", // Vue cần 'thumbnail', không phải 'image'
      regular_price: 600000,
      price: 500000,
      content: "<p>Áo thun chất liệu cotton...</p>",
      redirect: null
    },
    {
      id: 2,
      title: "Sky Tour Lightstick",
      thumbnail: "https://salt.tikicdn.com/cache/w1200/ts/product/03/96/c5/94c1694512387722b4c845233135d36c.jpg",
      regular_price: 1000000,
      price: 900000,
      content: "<p>Lightstick chính hãng...</p>",
      redirect: null
    },
    {
      id: 3,
      title: "Album Chúng Ta Của Hiện Tại",
      thumbnail: "https://i.scdn.co/image/ab67616d0000b273c5f6799cb1c033482f96a761",
      regular_price: 400000,
      price: 350000,
      content: "<p>Album bản giới hạn...</p>",
      redirect: null
    }
];

// API Lấy danh sách (Khớp với models/products.js gọi 'products')
app.get('/api/products', (req, res) => {
    console.log("✅ Frontend đã kết nối thành công lấy danh sách!");
    res.status(200).json({
        status: 200,
        data: products
    });
});

// API Lấy chi tiết
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        console.log(`✅ Frontend lấy chi tiết SP số: ${id}`);
        res.status(200).json({
            status: 200,
            data: product
        });
    } else {
        res.status(404).json({
            status: 404,
            message: "Not found"
        });
    }
});

// --- AUTHENTICATION ---
// Dữ liệu user (trong thực tế sẽ lưu vào database)
const users = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com', phone: '0901234567', address: 'HCM', verified: true }
];

const sessions = {};

// POST /api/authen - Login
app.post('/api/authen', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const sessionId = 'sess_' + Math.random().toString(36).substring(7);
        sessions[sessionId] = user.id;
        console.log(`✅ Login thành công: ${username}`);
        res.status(200).json({
            status: 200,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                sessionId: sessionId
            }
        });
    } else {
        console.log(`❌ Login thất bại: ${username}`);
        res.status(401).json({
            status: 401,
            data: null,
            message: 'Invalid credentials'
        });
    }
});

// GET /api/authen - Check session / Get current user
app.get('/api/authen', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    const userId = sessions[sessionId];
    
    if (userId) {
        const user = users.find(u => u.id === userId);
        console.log(`✅ Check session thành công: user ${user.username}`);
        res.status(200).json({
            status: 200,
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } else {
        console.log(`❌ Session không hợp lệ`);
        res.status(401).json({
            status: 401,
            data: null,
            message: 'Not authenticated'
        });
    }
});

// DELETE /api/authen - Logout
app.delete('/api/authen', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    delete sessions[sessionId];
    console.log(`✅ Logout thành công`);
    res.status(200).json({
        status: 200,
        data: null,
        message: 'Logged out'
    });
});

// --- USERS / ACCOUNTS ---
// POST /api/users - Create new account
app.post('/api/users', (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if user exists
    if (users.find(u => u.username === username || u.email === email)) {
        console.log(`❌ User ${username} đã tồn tại`);
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Username hoặc email đã được sử dụng'
        });
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        phone: '',
        address: '',
        verified: false
    };
    users.push(newUser);
    
    console.log(`✅ Tạo tài khoản mới: ${username}`);
    res.status(200).json({
        status: 200,
        data: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            message: 'Kiểm tra email để xác minh tài khoản'
        }
    });
});

// POST /api/users/verify - Verify account
app.post('/api/users/verify', (req, res) => {
    const { user_id, verify_code } = req.body;
    const user = users.find(u => u.id === user_id);
    
    if (!user) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: 'User not found'
        });
    }
    
    // Trong thực tế sẽ kiểm tra verify_code từ email
    user.verified = true;
    console.log(`✅ Xác minh email thành công cho user ${user.username}`);
    
    res.status(200).json({
        status: 200,
        data: null,
        message: 'Email verified successfully'
    });
});

// PUT /api/users - Update user profile
app.put('/api/users', (req, res) => {
    const { password, phone, address } = req.body;
    const sessionId = req.headers['x-session-id'];
    const userId = sessions[sessionId];
    
    if (!userId) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Not authenticated'
        });
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: 'User not found'
        });
    }
    
    if (password) user.password = password;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    console.log(`✅ Cập nhật profile user ${user.username}`);
    res.status(200).json({
        status: 200,
        data: user
    });
});

// --- CART ---
const carts = {}; // { userId: [{ cart_id, product_id, title, thumbnail, quantity, total_price }] }

// PUT /api/cart - Add to cart
app.put('/api/cart', (req, res) => {
    const { product_id, quantity } = req.body;
    const sessionId = req.headers['x-session-id'];
    const userId = sessions[sessionId];
    
    if (!userId) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Not authenticated'
        });
    }
    
    if (!carts[userId]) {
        carts[userId] = [];
    }
    
    const product = products.find(p => p.id === product_id);
    if (!product) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: 'Product not found'
        });
    }
    
    const existingItem = carts[userId].find(item => item.product_id === product_id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total_price = existingItem.quantity * product.price;
    } else {
        carts[userId].push({
            cart_id: Math.random().toString(36).substring(7),
            product_id,
            title: product.title,
            thumbnail: product.thumbnail,
            quantity,
            total_price: quantity * product.price
        });
    }
    
    console.log(`✅ Thêm sản phẩm ${product.title} vào giỏ hàng (số lượng: ${quantity})`);
    res.status(200).json({
        status: 200,
        data: carts[userId]
    });
});

// GET /api/cart/items - Get cart items
app.get('/api/cart/items', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    const userId = sessions[sessionId];
    
    if (!userId) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Not authenticated'
        });
    }
    
    const cart = carts[userId] || [];
    
    console.log(`✅ Lấy giỏ hàng của user ${userId}`);
    res.status(200).json({
        status: 200,
        data: cart
    });
});

// PUT /api/cart/:id - Update cart item quantity
app.put('/api/cart/:id', (req, res) => {
    const { quantity } = req.body;
    const cartItemId = req.params.id;
    const sessionId = req.headers['x-session-id'];
    const userId = sessions[sessionId];
    
    if (!userId) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Not authenticated'
        });
    }
    
    if (!carts[userId]) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: 'Cart not found'
        });
    }
    
    const item = carts[userId].find(i => i.cart_id === cartItemId);
    
    if (!item) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: 'Cart item not found'
        });
    }
    
    if (quantity <= 0) {
        carts[userId] = carts[userId].filter(i => i.cart_id !== cartItemId);
    } else {
        const product = products.find(p => p.id === item.product_id);
        item.quantity = quantity;
        item.total_price = quantity * product.price;
    }
    
    console.log(`✅ Cập nhật quantity cart item ${cartItemId}`);
    res.status(200).json({
        status: 200,
        data: carts[userId]
    });
});

// --- CHECKOUT ---
// POST /api/checkout/transfer - Submit transfer order
app.post('/api/checkout/transfer', (req, res) => {
    const { name } = req.body;
    const sessionId = req.headers['x-session-id'];
    const userId = sessions[sessionId];
    
    if (!userId) {
        return res.status(401).json({
            status: 401,
            data: null,
            message: 'Not authenticated'
        });
    }
    
    const cart = carts[userId];
    
    if (!cart || cart.length === 0) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Cart is empty'
        });
    }
    
    const orderId = 'ORD_' + Math.random().toString(36).substring(7).toUpperCase();
    console.log(`✅ Tạo đơn hàng transfer thành công: ${orderId}, tên người nhận: ${name}`);
    
    // Clear cart
    carts[userId] = [];
    
    res.status(200).json({
        status: 200,
        data: {
            order_id: orderId,
            name,
            message: 'Đơn hàng đã được tạo. Vui lòng chuyển khoản theo hướng dẫn'
        }
    });
});

// --- PAGES ---
// GET /api/pages/policy - Get privacy policy
app.get('/api/pages/policy', (req, res) => {
    const policy = {
        title: 'Chính sách bảo mật',
        content: `
            <h2>Chính sách Bảo mật Thông tin</h2>
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.</p>
            <h3>1. Thu thập thông tin</h3>
            <p>Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ tốt nhất.</p>
            <h3>2. Sử dụng thông tin</h3>
            <p>Thông tin của bạn sẽ được sử dụng để xử lý đơn hàng và cải thiện dịch vụ.</p>
            <h3>3. Bảo mật</h3>
            <p>Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu của bạn.</p>
        `
    };
    
    console.log(`✅ Lấy chính sách bảo mật`);
    res.status(200).json({
        status: 200,
        data: policy
    });
});

app.listen(PORT, () => {
    console.log(`Server Node.js đang chạy tại: http://localhost:${PORT}`);
});