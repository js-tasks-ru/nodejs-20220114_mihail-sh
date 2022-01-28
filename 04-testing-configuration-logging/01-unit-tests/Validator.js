//npm test -- --grep "testing-configuration-logging/unit-tests"
/*module.exports = */class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors.push({ field, error: `expect ${rules.type}, got ${type}` });
        //return errors;
        continue;//исправил, продолжаем проверять остальные объекты
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({ field, error: `too short, expect ${rules.min}, got ${value.length}` });
          }
          if (value.length > rules.max) {
            errors.push({ field, error: `too long, expect ${rules.max}, got ${value.length}` });
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({ field, error: `too little, expect ${rules.min}, got ${value}` });
          }
          if (value > rules.max) {
            // исправил rules.min на rules.max
            errors.push({ field, error: `too big, expect ${rules.max}, got ${value}` });
          }
          break;
      }
    }

    return errors;
  }
};

module.exports = Validator;

/*const validator = new Validator({
  age: {
    type: 'number1',
    min: 5,
    max: 10,
  },
});

console.log(validator.validate({ age: 7 }));*/


