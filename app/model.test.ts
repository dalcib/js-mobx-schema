import {
  autorun,
  isObservable,
  observe,
  reaction,
  useStrict,
  whyRun,
} from 'mobx'
import ClassDecoratorExample from './example'
import Model from './model'

const model = new Model(ClassDecoratorExample)
let count = 0

beforeEach(() => {
  autorun(() => {
    const name: string | undefined = model.data.name
    const age: number = model.data.age
    count = count + 1 /* whyRun(), console.log('a',count)}*/
  })
})

describe('Model', () => {
  it('should autorun', () => {
    // autorun(() => {count = count + 1 /*whyRun(), console.log('b',count, model.data.name)*/} )
    model.data.name = 'Dalci Bagol'
    model.data.age = 49
    expect(count).toEqual(3)
  })

  it('should model.data to be observable', () => {
    //console.log('isObservable', isObservable(model.data));
    expect(isObservable(model.data)).toBeTruthy()
  })

  it('should update React compnent', () => {
    let value: any
    const changed = observe(model.data, (newValue: any) => (value = newValue))
    model.handleChange('name', 'abcd')
    //console.log('value:',value)
    expect(value.type).toEqual('update')
    expect(value.name).toEqual('name')
    expect(value.oldValue).toEqual('Dalci Bagol')
    expect(value.newValue).toEqual('abcd')
  })
})

describe('modelStore', () => {
  let modelStore: Model<ClassDecoratorExample>

  it('makes todos observable', () => {
    modelStore = new Model(ClassDecoratorExample)

    let isObserved = false
    /*const observation = observe(modelStore, 'data', (changes) => {
      isObserved = true;
    });*/
    //console.log('isObservable', isObservable(modelStore), isObservable(modelStore.data)/*, isObservable(modelStore.data.name)*/);

    reaction(
      () => modelStore.data.name,
      data => {
        console.log('data', data)
        isObserved = true
      }
    )

    modelStore.data.name = 'something else'
    expect(isObserved).toEqual(true)
  })
})

describe('validate', () => {
  it('should error', () => {
    model.data.name = 'asdas'
    model.handleChange('name', { sdfsfsd: 234 })
    expect(model.errors).toBeTruthy()
    console.log(model.errors, model.errorsMessages, model.errorsText)
  })

  it('should set errors', () => {
    expect(model.errors && model.errors.length).toEqual(3)
    model.data.name = 'dalci'
    expect(model.errors && model.errors.length).toEqual(2)
    model.data.age = 48
    expect(model.errors && model.errors.length).toEqual(2)
    model.data.age = 20
    expect(model.errors && model.errors.length).toEqual(1)
    model.data.date = 'xxx'
    expect(model.errors && model.errors.length).toEqual(2)
    model.data.lastName = 'asdfgg'
    expect(model.errors && model.errors.length).toEqual(1)
  })
})
