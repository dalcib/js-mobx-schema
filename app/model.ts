import * as Ajv from 'ajv'
import {
  autorun,
  computed,
  extendObservable,
  observable,
  toJS,
  action,
} from 'mobx'
import { JsonSchema } from './JsonSchema'

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  verbose: true,
  errorDataPath: 'property',
  //jsonPointers: true,
})

interface NoParamConstructor<T> {
  schema: JsonSchema
  new (): T
}

export default class Model<T> {
  @observable data: T
  @observable isValid: boolean | Ajv.Thenable<boolean>
  @observable errors: Ajv.ErrorObject[] | undefined
  @computed
  get errorsText() {
    return ajv.errorsText(this.errors)
  }
  @computed
  get errorsMessages() {
    return this.convertErrors(this.errors)
    //return normaliseErrorMessages(this.errors)
  }
  //@observable errorsMessages: any

  constructor(SchemaClass: NoParamConstructor<T>) {
    const instance: T | any = new SchemaClass()
    const properties = SchemaClass.schema.properties
    Object.keys(properties).forEach((key: string) => {
      const defaultValue: any = (properties as any)[key].default
      if (!instance[key]) {
        if ((properties as any)[key].type === 'array') {
          instance[key] = []
        } else {
          if (!instance[key]) {
            instance[key] = defaultValue
          }
        }
      }
    })

    this.data = extendObservable(instance, instance)
    const validate: Ajv.ValidateFunction = ajv.compile(SchemaClass.schema)
    autorun(() => {
      this.isValid = validate(toJS(this.data))
      this.errors = validate.errors
      //this.errorsMessages = this.convertErrors(validate.errors)
    })
  }
  convertErrors(errors: Ajv.ErrorObject[] | undefined) {
    if (errors) {
      return errors.reduce((result: any, error: Ajv.ErrorObject) => {
        result[error.dataPath.substr(1)] = error.message
        return result
      }, {})
    } else {
      return 'null'
    }
  }

  toJS() {
    return toJS(this)
  }

  @action
  handleChange = (field: keyof T, value: any) => {
    this.data[field] = value
  }

  l = (
    field: keyof T,
    {
      changeEvent = 'onChange',
      targetProperty = 'value',
      valueKey = 'value',
    } = {}
  ) => ({
    [changeEvent]: (e: FormEvent | string): void => {
      let newValue
      if (!(typeof e === 'string') && e && e.target) {
        const type = e.target.getAttribute('type')
        newValue =
          type === 'checkbox'
            ? e.target.checked === true
            : e.target[targetProperty]
      } else {
        newValue = e
      }
      this.handleChange(field, newValue)
    },
    [valueKey]: this.data[field],
  })
}

interface MyEventTarget extends EventTarget {
  value: string
  checked?: boolean
  type?: string
  [key: string]: any
}

interface FormEvent {
  target: MyEventTarget
}
