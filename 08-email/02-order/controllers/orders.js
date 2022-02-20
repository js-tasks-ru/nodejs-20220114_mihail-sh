const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;

  const productDoc = await Product.findById(product);

  const order = new Order({
    user: ctx.user,
    product: productDoc,
    phone: phone,
    address: address,
  });

  await order.save();

  await sendMail({
    template: 'order-confirmation',
    locals: mapOrderConfirmation(order, productDoc),
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.status = 200;
  ctx.body = { order: order._id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({ user: ctx.user }).populate('product');
  ctx.body = { orders: orders.map(mapOrder) };
};
