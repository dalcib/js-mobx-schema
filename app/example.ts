import { schema } from './decorator'
import { JsonSchema } from './JsonSchema'

class Project {
  static schema: JsonSchema = { id: 'Project' }
  @schema({ required: true })
  id: number
  @schema() owner: string
  @schema() goal: string
}

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
  firstName: string

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
  date: string //= new Date().toJSON().substr(0, 10)

  @schema({ type: 'array' /*, items: [{ type: 'string' }]*/ })
  list: string[]

  @schema() project = new Project()

  @schema({
    properties: { message: { type: 'string' }, checked: { type: 'boolean' } },
  })
  task: { message: string; checked: boolean }
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
    firstName: { minLength: 5, type: 'string' },
    lastName: { minLength: 5, type: 'string' },
    list: { type: 'array' },
    name: { default: 'fghkkk', title: 'Name', type: 'string' },
    project: {
      $schema: 'http://json-schema.org/schema#',
      description: '',
      id: 'Project',
      properties: {
        goal: { type: 'string' },
        id: { type: 'number' },
        owner: { type: 'string' },
      },
      required: ['id'],
      title: 'Project',
      type: 'object',
    },
    task: {
      properties: {
        checked: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
      },
      type: 'object',
    },
  },
  required: ['firstName', 'lastName'],
  title: 'ClassDecoratorExample',
  type: 'object',
}

export default ClassDecoratorExample
