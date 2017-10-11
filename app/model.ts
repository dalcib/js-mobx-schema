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

interface NoParamConstructor<H> {
  [key: string]: any
  //[key: string]: H[keyof H] | JsonSchema
  schema: JsonSchema
  new (): H
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
    const instance = new SchemaClass()
    //const properties = SchemaClass.schema.properties
    const emptyInstance = this.getEmpty(instance, SchemaClass.schema.properties)

    this.data = extendObservable(emptyInstance, emptyInstance)
    const validate: Ajv.ValidateFunction = ajv.compile(SchemaClass.schema)
    autorun(() => {
      this.isValid = validate(toJS(this.data))
      this.errors = validate.errors
      //this.errorsMessages = this.convertErrors(validate.errors)
    })
  }

  getEmpty(
    instance: T,
    properties: { [property: string]: JsonSchema } | undefined
  ) {
    const emptyInstance: T = instance
    if (properties) {
      Object.keys(properties).forEach((key: keyof T) => {
        const defaultValue: any = properties[key].default
        if (properties[key].type === 'object') {
          let schema: JsonSchema = properties[key] || {}
          let objectInstance: T = {} as T
          if (instance[key] && instance[key].constructor) {
            const Constructor: any = emptyInstance[key].constructor
            const schemaConstructor: JsonSchema =
              (emptyInstance[key].constructor as any).schema || {}
            objectInstance = new Constructor()
            schema = { ...schemaConstructor }
          }
          ;(emptyInstance as any)[key] = this.getEmpty(
            objectInstance,
            schema.properties
          )
        }
        if (!emptyInstance[key]) {
          if (properties[key].type === 'array') {
            emptyInstance[key] = <any>[]
          } else {
            if (!emptyInstance[key]) {
              emptyInstance[key] = defaultValue
            }
          }
        }
      })
    }
    return emptyInstance
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

  @action
  add = (arrayName: keyof T) => {
    if (this.data.hasOwnProperty(arrayName)) {
      if (this.data[arrayName] instanceof Array) {
        if (Array.isArray(this.data[arrayName])) {
          ;(this.data[arrayName] as any).push({})
        }
      }
    }
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

interface MyEventTarget /* extends EventTarget */ {
  value: string
  checked?: boolean
  type?: string
  [key: string]: any
}

interface FormEvent {
  target: MyEventTarget
}
