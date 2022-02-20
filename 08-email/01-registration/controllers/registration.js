const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;
  const userToFind = await User.findOne({ email });

  if (userToFind) {
    ctx.status = 400;
    ctx.body = { errors: { email: 'Такой email уже существует' } };
    return;
  }

  const verificationToken = uuid();
  const u = new User({ email, displayName, verificationToken });
  await u.setPassword(password);
  await u.save();
  await sendMail({
    template: 'confirmation',
    locals: { token: verificationToken },
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.status = 200;
  ctx.body = { status: 'ok' };
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;

  const userToFind = await User.findOne({ verificationToken: verificationToken });
  if (!userToFind) {
    ctx.status = 400;
    ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
    return;
  }

  userToFind.verificationToken = undefined;
  await userToFind.save();
  const token = await ctx.login(userToFind);
  ctx.status = 200;
  ctx.body = { token: token };
};
