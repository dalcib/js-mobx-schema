import ClassDecoratorExample from "./index";
import Model from './model';
import { autorun, whyRun, isObservable } from 'mobx';

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

/*describe('Get empty object:', () => {
  it('getEmpty()', () => {
    //console.log(example.schema, example.constructor.prototype.schema, example.constructor.schema);
    expect(example.getEmpty()).toMatchSnapshot()
    model.getEmpty()
    expect(model.data).toEqual(example.getEmpty())
  })
})*/

/*describe('Get empty model:', () => {
  it('getEmpty()', () => {
    expect(model.data).toMatchSnapshot()
    model.getEmpty()
    expect(model.data).toMatchSnapshot()
  })
})*/

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


describe('Observable', () => {
  let count = 0
  autorun(() => {count = count + 1; /*whyRun()*/ } )
  example.name = 'Melina'
  example.name = 'Melina Bagolin'
  example.point = true
  //console.log('isObservablecc', isObservable(example.point))
  it('should run', () => {
    expect(count).toEqual(1)
  });

});

