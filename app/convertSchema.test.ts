import {JsonSchema} from './JsonSchema'
import {MySchema} from './MySchema'
import convert from './convertSchema'

const mySchema: MySchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Contact Schema',
  description:
    'The Contact Archetype - Essential properties that define a Contact',
  type: () => 'object',
  additionalProperties: false,
  properties: {
    _id: {
      type: Boolean,
      description: 'Unique identifier for this archetype record',
      maxLength: () => {
        return 5 * 23
      },
      default: ''
    },
    _sid: {
      type: String,
      description: 'Unique short identifier for this archetype record',
      maxLength: 50,
      default: ''
    },
    servant_id: {
      type: String,
      description: () => 'The servant to whom this record belongs' + '!!!!!',
      maxLength: 50,
      default: ''
    },
    email_addresses: {
      type: 'array',
      description: 'Email addresses associated with this contact',
      uniqueItems: true,
      additionalItems: false,
      maxItems: 10,
      default: [],
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          email_address_name: {
            type: 'string',
            description:
              'The name of this email address (e.g., Home, Business, etc.)',
            maxLength: 50,
            default: ''
          },
          email_address: {
            type: 'string',
            description: 'The email address',
            maxLength: 100,
            default: ''
          }
        }
      }
    },
    phone_numbers: {
      type: 'array',
      description: 'Phone numbers associated with this contact',
      uniqueItems: true,
      additionalItems: false,
      maxItems: 10,
      default: [],
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          phone_number_name: {
            type: 'string',
            description:
              'The name of this phone number (e.g., Home, Business, etc.)',
            maxLength: 50,
            default: ''
          },
          phone_number: {
            type: 'string',
            description: 'The phone number',
            maxLength: 100,
            default: ''
          }
        }
      }
    }
  }
}

let newJson = convert(mySchema)

const jsonSchema: JsonSchema = {
  // tslint:disable-line
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Contact Schema',
  description:
    'The Contact Archetype - Essential properties that define a Contact',
  type: 'object',
  additionalProperties: false,
  properties: {
    _id: {
      type: 'boolean',
      description: 'Unique identifier for this archetype record',
      maxLength: 115,
      default: ''
    },
    _sid: {
      type: 'string',
      description: 'Unique short identifier for this archetype record',
      maxLength: 50,
      default: ''
    },
    servant_id: {
      type: 'string',
      description: 'The servant to whom this record belongs!!!!!',
      maxLength: 50,
      default: ''
    },
    email_addresses: {
      type: 'array',
      description: 'Email addresses associated with this contact',
      uniqueItems: true,
      additionalItems: false,
      maxItems: 10,
      default: [],
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          email_address_name: {
            type: 'string',
            description:
              'The name of this email address (e.g., Home, Business, etc.)',
            maxLength: 50,
            default: ''
          },
          email_address: {
            type: 'string',
            description: 'The email address',
            maxLength: 100,
            default: ''
          }
        }
      }
    },
    phone_numbers: {
      type: 'array',
      description: 'Phone numbers associated with this contact',
      uniqueItems: true,
      additionalItems: false,
      maxItems: 10,
      default: [],
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          phone_number_name: {
            type: 'string',
            description:
              'The name of this phone number (e.g., Home, Business, etc.)',
            maxLength: 50,
            default: ''
          },
          phone_number: {
            type: 'string',
            description: 'The phone number',
            maxLength: 100,
            default: ''
          }
        }
      }
    }
  }
}

describe('tesc convertion of MySchema to JsonSchema', () => {
  it('should convert', () => {
    expect(newJson).toEqual(jsonSchema)
  })
})
