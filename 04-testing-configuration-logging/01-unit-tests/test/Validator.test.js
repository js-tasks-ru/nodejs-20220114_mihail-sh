const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('Общая проверка строковых правил', () => {
      it('валидатор проверяет строковое поле на некорректное значение', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('валидатор проверяет строковое поле на корректное значение', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 7,
          },
        });

        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(0);
      });

      it('валидатор проверяет несколько строковых полей на некорректные значение', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 4,
            max: 4,
          },
          name2: {
            type: 'string',
            min: 6,
            max: 6,
          },
        });

        const errors = validator.validate({ name: 'Rob', name2: 'William' });

        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 4, got 3');
        expect(errors[1]).to.have.property('field').and.to.be.equal('name2');
        expect(errors[1]).to.have.property('error').and.to.be.equal('too long, expect 6, got 7');
      });
    });

    describe('Общая проверка числовых правил', () => {
      it('валидатор проверяет числовое поле на корректное значение (в HEX)', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({ age: 0xF });

        expect(errors).to.have.length(0);
      });

      //тест не проходит, исправил ошибку в коде на rules.max
      it('валидатор проверяет несколько числовых полей на некорректные значения', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 30,
            max: 40,
          },
          age2: {
            type: 'number',
            min: 16,
            max: 40,
          },
        });

        const errors = validator.validate({ age: 41, age2: 0xF });

        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 40, got 41');
        expect(errors[1]).to.have.property('field').and.to.be.equal('age2');
        expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 16, got 15');
      });
    });

    describe('Специальные проверки правил', () => {
      it('валидатор проверяет корректные граничные значения строкового поля', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 5,
          },
        });

        const errors = validator.validate({ name: 'Sarah' });
        expect(errors).to.have.length(0);
      });

      it('валидатор проверяет корректные граничные значения числового поля', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 10,
          },
        });

        const errors = validator.validate({ age: 10 });
        expect(errors).to.have.length(0);
      });

      it('валидатор проверяет числовое и строковое поле одновременно в произвольном порядке', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 5,
            max: 10,
          },
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
        });

        const errors = validator.validate({ name: 'Robin', age: 10 });
        expect(errors).to.have.length(0);
      });

      it('валидатор проверяет числовое поле с неверным типом и строковое поле с верным типом', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 5,
            max: 10,
          },
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
        });

        const errors = validator.validate({ age: '10', name: 'Sarah' });
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      //тест не проходит. если оба типа неверные, то возвращается только первая ошибка. исправил в коде
      it('валидатор проверяет числовое и строковое поле, когда оба имеют неверный тип', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 5,
            max: 10,
          },
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
        });

        const errors = validator.validate({ age: '10', name: 12345 });
        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
        expect(errors[1]).to.have.property('field').and.to.be.equal('name');
        expect(errors[1]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('валидатор проверяет числовое поле с неизвестным типом', () => {
        const validator = new Validator({
          age: {
            type: 'number1',
            min: 5,
            max: 10,
          },
        });

        const errors = validator.validate({ age: 7 });
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number1, got number');
      });

      it('валидатор проверяет строкове поле с неизвестным типом', () => {
        const validator = new Validator({
          name: {
            type: 'string1',
            min: 5,
            max: 10,
          },
        });

        const errors = validator.validate({ name: 'Bob' });
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string1, got string');
      });

      it('валидатор проверяет корреткное строковое поле и некорректное числовое поле', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 4,
            max: 6,
          },
          age: {
            type: 'number',
            min: 6,
            max: 6,
          },
        });

        const errors = validator.validate({ name: 'Robert', age: 7 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 6, got 7');
      });
    });
  });
});
