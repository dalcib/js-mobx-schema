import {observable, extendObservable, computed} from 'mobx'
import {JsonSchema} from './JsonSchema'
import Ajv from 'ajv'

const ajv = new Ajv({
  allErrors: true,
  v5: true,
  useDefaults: true,
  verbose: true
})

export default class Model {
  schema: JsonSchema
  @observable data: any
  validate: Ajv.ValidateFunction
  @computed
  get valid(): boolean | Ajv.Thenable<boolean> {
    return this.validate(this.data)
  }
  @observable errors: Ajv.ErrorObject[] | undefined
  @computed
  get errorsText() {
    return ajv.errorsText(this.errors)
  }
  @computed
  get errorsMessages() {
    if (this.errors) {
      this.errors.map(error => {
        return {[error.dataPath]: error.keyword + error.message}
      })
    } else {
      return {error: 'sdfsdf'}
    }
  }
  //SchemaClass: any
  constructor(SchemaClass: any) {
    const instanceSchema = new SchemaClass()
    this.schema = SchemaClass.schema
    this.validate = ajv.compile(this.schema)
    const properties = this.schema.properties
    Object.keys(properties).forEach((key: string) => {
      const defaultValue: any = (properties as any)[key].default
      if (!instanceSchema[key]) {
        if ((properties as any)[key].type === 'array') {
          instanceSchema[key] = []
        } else {
          instanceSchema[key] = defaultValue
        }
      }
    })
    const data = {}
    Object.keys(instanceSchema).map(field => {
      extendObservable(data, {[field]: instanceSchema[field]})
    })
    this.data = data
    this.validate(this.data)
    this.errors = this.validate.errors
  }

  toJS() {
    return JSON.stringify(this)
  }

  handleChange = (field: string, value: any) => {
    this.validate(this.data)
    this.errors = this.validate.errors
    this.data[field] = value
  }
}
