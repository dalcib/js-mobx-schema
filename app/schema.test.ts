import ClassDecoratorExample, { classSchema } from './example'
import Model from './model'
import { autorun, whyRun, isObservable } from 'mobx'

//const classDecoratorExample = new ClassDecoratorExample()
const example = new ClassDecoratorExample()
//const model = new Model(ClassDecoratorExample)

describe('non-static decorator', () => {
  it('static', () => {
    expect(ClassDecoratorExample.schema).toBeDefined()
  })
})

describe('class', () => {
  it('instanciate', () => {
    expect(example).toMatchSnapshot()
  })
})

describe('schema', () => {
  it('snapshot', () => {
    expect(ClassDecoratorExample.schema).toMatchSnapshot()
  })
})

describe('schema', () => {
  it('generated', () => {
    expect(ClassDecoratorExample.schema).toEqual(classSchema)
  })
})
