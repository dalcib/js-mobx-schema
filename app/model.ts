import { autorun, observable, extendObservable, computed } from 'mobx'
import { JsonSchema } from './JsonSchema'
import Ajv from 'ajv'

const ajv = new Ajv({
  allErrors: true,
  v5: true,
  useDefaults: true,
  verbose: true,
})

export default class Model {
  schema: JsonSchema
  @observable data: any = {}
  @observable isValid: boolean | Ajv.Thenable<boolean>
  @observable errors: Ajv.ErrorObject[] | undefined
  @computed
  get errorsText() {
    return ajv.errorsText(this.errors)
  }
  @computed
  get errorsMessages() {
    if (this.errors) {
      this.errors.map(error => {
        return { [error.dataPath]: error.keyword + error.message }
      })
    } else {
      return { error: 'sdfsdf' }
    }
  }

  constructor(SchemaClass: any) {
    const instance = new SchemaClass()
    this.schema = SchemaClass.schema
    const properties = this.schema.properties
    Object.keys(properties).forEach((key: string) => {
      const defaultValue: any = (properties as any)[key].default
      if (!instance[key]) {
        if ((properties as any)[key].type === 'array') {
          instance[key] = []
        } else {
          if (!instance[key]) {
            this.data[key] = defaultValue
          }
        }
      }
    })
    extendObservable(this.data, instance)
    const validate: Ajv.ValidateFunction = ajv.compile(this.schema)
    autorun(() => {
      this.isValid = validate(this.data)
      this.errors = validate.errors
    })
  }

  toJS() {
    return JSON.stringify(this.data)
  }

  handleChange = (field: string, value: any) => {
    //this.validate(this.data)
    //this.errors = this.validate.errors
    this.data[field] = value
  }
}
