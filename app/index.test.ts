import ClassDecoratorExample from "./index";
import Model from './model';

//const classDecoratorExample = new ClassDecoratorExample()
const example = new ClassDecoratorExample()
const model = new Model(ClassDecoratorExample)

/*const schema = {
  description: 'teste',
  properties: {
    name: { type: 'string', title: 'Name', default: 'fghk' },
    age: { type: 'Numberd', default: 15 },
    ages: {
        maximum: 23,
    },
  date: {
   format: "date",
    }
  }
}*/

describe('non-static decorator', () => {
  it('static', () => {
    expect(ClassDecoratorExample.schema).toBeDefined()
  })
})

describe('Get empty object:', () => {
  it('getEmpty()', () => {
    expect(example.getEmpty()).toMatchSnapshot()
    model.getEmpty()
    expect(model.data).toEqual(example.getEmpty())
  })
})

describe('Get empty model:', () => {
  it('getEmpty()', () => {
    expect(model.data).toMatchSnapshot()
    model.getEmpty()
    expect(model.data).toMatchSnapshot()
  })
})

describe('model', () => {
  it('instanciate', () => {
    expect(model).toMatchSnapshot()
  })
})

describe('static decorator', () => {
  it('static', () => {
    expect(model.schema).toMatchSnapshot()
  })
})
