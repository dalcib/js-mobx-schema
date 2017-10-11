import * as React from 'react'
import { observer } from 'mobx-react'
import { FormState } from 'formstate'
import ClassDecoratorExample from './example'
import Model from './model'
import FieldState from './fieldState'

const model = new Model(ClassDecoratorExample)

class State {
  // Create a field
  age = new FieldState(model.data.age, model, 'age').validators(
    val => !val && 'username required'
  )

  // Compose fields into a form
  form = new FormState({
    age: this.age,
  })

  onSubmit = async () => {
    //  Validate all fields
    const res = await this.form.validate()
    // If any errors you would know
    if (res.hasError) {
      console.log(this.form.error)
      return
    }
    // Yay .. all good. Do what you want with it
    console.log(this.age.$) // Validated value!
  }
}

@observer
export default class App extends React.Component<{}, {}> {
  data = new State()
  render() {
    const data = this.data
    return (
      <form onSubmit={data.onSubmit}>
        <input
          type="text"
          value={data.age.value}
          onChange={e => data.age.onChange(Number(e.target.value))}
        />
        <p>{data.age.value}</p>
        <p>{model.data.age}</p>
        <p>{model.data.ages}</p>
        <p>{data.age.error}</p>
        <p>{data.form.error}</p>
      </form>
    )
  }
}
