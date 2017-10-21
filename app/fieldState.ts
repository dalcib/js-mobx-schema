import { FieldState } from 'formstate'
import { autorun } from 'mobx'
import Model from './model'

export default class MyFieldState<TValue> extends FieldState<TValue> {
  field: string
  constructor(_initValue: TValue, store: Model<any>, field: string) {
    super(_initValue)
    this.field = field
    autorun(() => store.handleChange(field, this.value))
    this.validators(()=> store.fieldError(field))
  }

  /* onChangeValue = (value: TValue) => {
    this.store.onChange(value, this.field) 
    this.onChange(value)
  } */
}
