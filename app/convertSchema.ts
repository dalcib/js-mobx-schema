import {JsonSchema} from './JsonSchema'

export default function convert(schema: any): JsonSchema {
  let newSchema: JsonSchema = {}
  Object.keys(schema).map((key: string ) => {
    if (Object.prototype.toString.call(schema[key]) === '[object Function]') {
      (newSchema as any)[key] = schema[key]()
    }
    /*if (Object.prototype.toString.call(schema[key]) === '[object Object]') {
      (newSchema as any)[key] = convert(schema[key])
    }*/
    switch (key) {
      case 'properties':
        let properties = {}
        Object.keys(schema.properties).map(subKey => {
          (properties as any)[subKey] = convert(schema.properties[subKey])
        })
        newSchema.properties = properties
        properties
        break;
      case 'items':
        newSchema.items = convert(schema.items)
        break;
      case 'type':
        if (typeof schema[key] !== 'string' && (
          schema[key] === String ||
          schema[key] === Number ||
          schema[key] === Boolean ||
          schema[key] === Array ||
          schema[key] === Object)
          ) {
            newSchema[key] = schema[key].name.toLowerCase()
        } else {
          newSchema[key] = schema[key]
        }
        break;
      default:
        (newSchema as any)[key] = schema[key]
        break;
    }
  })
  return newSchema
}

const jsonSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Contact Schema",
    "description": "The Contact Archetype - Essential properties that define a Contact",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "_id": {
            "type": Boolean,
            "description": "Unique identifier for this archetype record",
            "maxLength": () => {return 50 * 23},
            "default": ""
        },
        "_sid": {
            "type": String,
            "description": "Unique short identifier for this archetype record",
            "maxLength": 50,
            "default": ""
        },
        "servant_id": {
            "type": String,
            "description": () => "The servant to whom this record belongs"+ "!!!!!",
            "maxLength": 50,
            "default": ""
        }
    },
        "email_addresses": {
            "type": "array",
            "description": "Email addresses associated with this contact",
            "uniqueItems": true,
            "additionalItems": false,
            "maxItems": 10,
            "default": [],
            "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "email_address_name": {
                        "type": "string",
                        "description": "The name of this email address (e.g., Home, Business, etc.)",
                        "maxLength": 50,
                        "default": ""
                    },
                    "email_address": {
                        "type": "string",
                        "description": "The email address",
                        "maxLength": 100,
                        "default": ""
                    }
                }
            }
        },
        "phone_numbers": {
            "type": "array",
            "description": "Phone numbers associated with this contact",
            "uniqueItems": true,
            "additionalItems": false,
            "maxItems": 10,
            "default": [],
            "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "phone_number_name": {
                        "type": "string",
                        "description": "The name of this phone number (e.g., Home, Business, etc.)",
                        "maxLength": 50,
                        "default": ""
                    },
                    "phone_number": {
                        "type": "string",
                        "description": "The phone number",
                        "maxLength": 100,
                        "default": ""
                    }
                }
            }
        }
}

let newJson = convert(jsonSchema)

newJson