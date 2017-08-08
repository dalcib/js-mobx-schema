import { schema } from './decorator'
import { JsonSchema } from './JsonSchema'

class ClassDecoratorExample {
  static schema: JsonSchema = {
    description: 'teste',
    properties: {
      name: { default: 'fghkkk' },
    },
  }

  @schema({ title: 'Name' })
  name?: string

  @schema({ required: true, minLength: 5 })
  lastName: string

  point: boolean = false

  @schema({ maximum: 23 })
  age: number = 16

  @schema()
  get ages(): number {
    return this.age * 2
  }

  @schema({ minimum: 4, type: 'integer' })
  cars: number

  @schema({ format: 'date' })
  date: string = new Date().toJSON().substr(0, 10)

  @schema({ type: 'array' /*, items: [{ type: 'string' }]*/ })
  list: string[]
}

const example = new ClassDecoratorExample()

export const classSchema = {
  $schema: 'http://json-schema.org/schema#',
  description: 'teste',
  id: 'ClassDecoratorExample',
  properties: {
    age: { maximum: 23, type: 'number' },
    ages: { type: 'number' },
    cars: { minimum: 4, type: 'integer' },
    date: { format: 'date', type: 'string' },
    lastName: { minLength: 5, type: 'string' },
    list: { type: 'array' },
    name: { default: 'fghkkk', title: 'Name', type: 'string' },
  },
  required: ['lastName'],
  title: 'ClassDecoratorExample',
  type: 'object',
}

export default ClassDecoratorExample
