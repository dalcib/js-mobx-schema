import { autorun, isObservable, whyRun, observe, useStrict, reaction } from 'mobx';
import ClassDecoratorExample from './index';
import Model from './model';

const model = new Model(ClassDecoratorExample)
let count = 0

beforeEach(() => {
  autorun(() => {
    let name: any = model.data.name 
    let age: any = model.data.age 
    count = count + 1/* whyRun(), console.log('a',count)}*/
  })
  //model.data.name = 'Dalci B'
  //model.data.age = 48
  //model.data = {name: 'Dacli'}
  //console.log('XXXXXXXXXX',model.data.get())
});

describe('Model', () => {
  
  it('should autorun', () => {
   // autorun(() => {count = count + 1 /*whyRun(), console.log('b',count, model.data.name)*/} )
    model.data.name = 'Dalci Bagol'
    model.data.age = 49
    expect(count).toEqual(3)
  });

  
  it('should model.data to be observable', () => {
    //console.log('isObservable', isObservable(model.data));
    expect(isObservable(model.data)).toBeTruthy()
  });


  it('should update React compnent', () => {
    let value: any 
    const changed = observe(model.data, (newValue: any) =>  value = newValue)
    model.handleChange('name', 'abcd')
    //console.log('value:',value)
    expect(value.type).toEqual('update')
    expect(value.name).toEqual('name')
    expect(value.oldValue).toEqual('Dalci Bagol')
    expect(value.newValue).toEqual('abcd')
  });
  
  
  
});

describe('modelStore', () => {
  let modelStore: Model;

  it('makes todos observable', () => {
    modelStore = new Model(ClassDecoratorExample)
    modelStore.data

    let isObserved = false;
    /*const observation = observe(modelStore, 'data', (changes) => {
      isObserved = true;
    });*/
    //console.log('isObservable', isObservable(modelStore), isObservable(modelStore.data)/*, isObservable(modelStore.data.name)*/);
    
    reaction( 
      () => modelStore.data.name,
      (data) => {
        console.log('data', data)
        isObserved = true
      }
    )

    modelStore.data.name = 'something else';
    expect(isObserved).toEqual(true);
  });
})


describe('validate', () => {
  
  it('should error', () => {
    model.data.name = {}
    model.handleChange('name', {sdfsfsd: 234})
    expect(model.errors).toBeTruthy()
    console.log(model.errors, model.errorsMessages, model.errorsText)
  });
});
