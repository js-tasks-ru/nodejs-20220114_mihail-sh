// npm test -- --grep "authentication/oauth"
const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }

    //делаем Upsert
    const user = await User.findOneAndUpdate(
      // ищем либо по email у нас либо по email соцсети
      { $or: [{ [`socialNetwork.${strategy}`]: email }, { email: email }] },
      {
        email: email,
        displayName: displayName,
        [`socialNetwork.${strategy}`]: email, //добавляем новую соцсеть и email от неё 
        // или обновляем её, если пользователь поменял email в ней 
      },
      { upsert: true, new: true, runValidators: true }, // включаем проверки и апсерт
      // с получением объекта обновленного клиента или существующего
    );

    return done(null, user);
  } catch (e) {
    return done(e);
  }
  //done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
