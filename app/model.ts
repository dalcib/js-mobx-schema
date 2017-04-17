import ClassDecoratorExample from './index';

export default class Model {
  schema: any
  data: any
  errors: any
  newInstance: any
  constructor(SchemaClass: any) {
    this.schema = SchemaClass.schema
    this.data = new SchemaClass()
  }

  toJS() {
    return JSON.stringify(this)
  }

  getEmpty() {
    const properties = this.schema.properties
    const keys = Object.keys(properties)
    //const empty  = new ClassDecoratorExample()
    keys.forEach((key: string) => {
      const defaultValue: any = (properties as any)[key].default
      if (!((this.data)[key])) {
          (this.data)[key] = defaultValue
      }
    })
  }
}

const model = new Model(ClassDecoratorExample)

//console.log(model.toJS());
