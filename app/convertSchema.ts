import { JsonSchema } from './JsonSchema'
import { JsSchema } from './JsSchema'

//JsSchema allows to use 'string' instead '"string"' and functions instead values

export default function convert(mySchema: JsSchema): JsonSchema {
  const schema = { ...mySchema }
  const newSchema: JsonSchema = {}
  Object.keys(schema).map((key: string) => {
    if (
      Object.prototype.toString.call((schema as any)[key]) ===
        '[object Function]' &&
      ((schema as any)[key] !== String &&
        (schema as any)[key] !== Number &&
        (schema as any)[key] !== Boolean &&
        (schema as any)[key] !== Array &&
        (schema as any)[key] !== Object)
    ) {
      //console.log((schema as any)[key],typeof (schema as any)[key]);
      ;(schema as any)[key] = (schema as any)[key]()
    }
    switch (key) {
      case 'properties':
        const properties: any = {}
        if (schema.properties) {
          Object.keys(schema.properties).map(subKey => {
            properties[subKey] = convert((schema.properties as any)[subKey])
          })
          newSchema.properties = properties
        }
        break
      case 'items':
        if (Object.prototype.toString.call(schema.items) === '[object Array]') {
          Object.keys(schema.items).map(subKey => {
            ;(properties as any)[subKey] = convert(
              (schema.items as any)[subKey]
            )
          })
        } else {
          if (schema.items) {
            newSchema.items = convert(schema.items as any)
          }
        }
        break
      case 'type':
        if (
          typeof schema.type !== 'string' &&
          (schema.type === String ||
            schema.type === Number ||
            schema.type === Boolean ||
            schema.type === Array ||
            schema.type === Object)
        ) {
          newSchema.type = (schema as any)[key].name.toLowerCase()
        } else {
          ;(newSchema as any)[key] = schema[key]
        }
        break
      default:
        ;(newSchema as any)[key] = (schema as any)[key]
        break
    }
  })
  return newSchema
}
