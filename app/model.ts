// tslint:disable-next-line:ordered-imports
//import Ajv from 'ajv'
import * as Ajv from 'ajv'
import { autorun, computed, extendObservable, observable, toJS } from 'mobx'
import { JsonSchema } from './JsonSchema'

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  verbose: true,
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
    if (this.errors) {
      this.errors.map((error: any) => {
        return { [error.dataPath]: error.keyword + error.message }
      })
    } else {
      return { error: 'sdfsdf' }
    }
  }

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
    })
  }

  toJS() {
    return toJS(this)
  }

  handleChange = (field: keyof T, value: any) => {
    this.data[field] = value
  }
}
