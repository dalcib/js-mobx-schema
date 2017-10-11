import { FieldState } from 'formstate'
import { autorun } from 'mobx'
import Model from './model'

export default class MyFieldState<TValue> extends FieldState<TValue> {
  constructor(_initValue: TValue, store: Model<any>, field: string) {
    super(_initValue)
    autorun(() => store.handleChange(field, this.value))
  }

  /* onChangeValue = (value: TValue) => {
    this.store.onChange(value, this.field) 
    this.onChange(value)
  } */
}
