import Model from './model'
import ClassDecoratorExample from './example'
import { autorun, toJS } from 'mobx'

const model = new Model(ClassDecoratorExample)

autorun(() => {
  // tracking this so autorun() runs for every input change
  const validation = model.errors

  console.log(
    `Valid = ${model.isValid}`,
    model.data.ages,
    //toJS(model.errors),
    model.errorsText,
    toJS(model.data)
  )
  if (model.isValid) {
    console.log('--- Form Submitted ---')
  }
})

console.log(/*ClassDecoratorExample.schema,*/ toJS(model.data))

model.data.name = 'dalci'
model.data.age = 48
model.data.age = 20
model.data.date = 'xxx'
model.data.lastName = 'asdfgg'
model.data.list = ['1', '2', '3']
model.data.point = true

console.log(toJS(model.errors))
