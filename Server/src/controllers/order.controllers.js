import mongoose from 'mongoose';
import order from '../models/order.models.js';
import Product from '../models/product.models.js';
import User from '../models/user.models.js';

export const placeOrder = async (req, res) => {
    try {
        const { userId, products } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let totalPrice = 0;
        for (let productId of products) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productId} not found` });
            }
            totalPrice += product.price;
        }
        const newOrder = new order({
            user: userId,
            products: products,
            totalPrice: totalPrice,
        });
        const savedOrder = await newOrder.save();
        return res.status(201).json({
            message: 'Order placed successfully',
            order: savedOrder,
        });

    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'An error occurred while placing the order' });
    }
};

// Get Orders
export const getOrders = async (req, res) => {
    const { userId } = req.body;
    try {
        const orders = await order.find({ user: userId })
            .populate('products', 'name price')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
