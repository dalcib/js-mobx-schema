/**
 * JSON Schema is ultimately a nested definition system.  The root should always contain the $schema property,
 * but further definitions (typically stored on the object in the 'definitions' key of the root) can simply be
 * something like:
 * {
 *     "type": "string"
 * }
 */
//import { JsSchema } from './JsSchema'

export interface JsSchema {
  $ref?: string

  ///////////////////////////////////////////////////////////////////////////
  // Schema Metadata
  ///////////////////////////////////////////////////////////////////////////
  /**
   * This is important because it tells refs where the root of the document is located
   */
  id?: string
  /**
   * It is recommended that the meta-schema is included in the root of any json schema and must be a uri
   */
  $schema?: string
  /**
   * Title of the schema
   */
  title?: string | (() => string)
  /**
   * Schema description
   */
  description?: string | (() => string)
  /**
   * Default json for the object represented by this schema
   */
  'default'?: any

  ///////////////////////////////////////////////////////////////////////////
  // Number Validation
  ///////////////////////////////////////////////////////////////////////////
  /**
   * The value must be a multiple of the number (e.g. 10 is a multiple of 5)
   */
  multipleOf?: number
  maximum?: number | (() => number)
  /**
   * If true maximum must be > value, >= otherwise
   */
  exclusiveMaximum?: boolean
  minimum?: number | (() => number)
  /**
   * If true minimum must be < value, <= otherwise
   */
  exclusiveMinimum?: boolean

  ///////////////////////////////////////////////////////////////////////////
  // String Validation
  ///////////////////////////////////////////////////////////////////////////
  maxLength?: number | (() => number)
  minLength?: number | (() => number)
  /**
   * This is a regex string that the value must conform to
   */
  pattern?: string

  ///////////////////////////////////////////////////////////////////////////
  // Array Validation
  ///////////////////////////////////////////////////////////////////////////
  additionalItems?: boolean | JsSchema
  items?: JsSchema | JsSchema[]
  maxItems?: number | (() => number)
  minItems?: number | (() => number)
  uniqueItems?: boolean

  ///////////////////////////////////////////////////////////////////////////
  // Object Validation
  ///////////////////////////////////////////////////////////////////////////
  maxProperties?: number
  minProperties?: number
  required?: string[] | boolean
  additionalProperties?: boolean | JsSchema
  /**
   * Holds simple JSON Schema definitions for referencing from elsewhere
   */
  definitions?: { [key: string]: JsSchema }
  /**
   * The keys that can exist on the object with the json schema that should validate their value
   */
  properties?: { [property: string]: JsSchema }
  /**
   * The key of this object is a regex for which properties the schema applies to
   */
  patternProperties?: { [pattern: string]: JsSchema }
  /**
   * If the key is present as a property then the string of properties must also be present.
   * If the value is a JSON Schema then it must also be valid for the object if the key is present.
   */
  dependencies?: { [key: string]: JsSchema | string[] }

  ///////////////////////////////////////////////////////////////////////////
  // Generic
  ///////////////////////////////////////////////////////////////////////////
  /**
   * Enumerates the values that this schema can be (e.g. {"type": "string", "enum": ["red", "green", "blue"]})
   */
  'enum'?: any[]
  /**
   * The basic type of this schema, can be one of [string, number, object, array, boolean, null] or an array of
   * the acceptable types
   */
  type?: string | string[] | object

  format?: string

  ///////////////////////////////////////////////////////////////////////////
  // Combining Schemas
  ///////////////////////////////////////////////////////////////////////////
  allOf?: JsSchema[]
  anyOf?: JsSchema[]
  oneOf?: JsSchema[]
  /**
   * The entity being validated must not match this schema
   */
  not?: JsSchema

  ///////////////////////////////////////////////////////////////////////////
  // Hyperfish Specific
  ///////////////////////////////////////////////////////////////////////////
  /*viewProperties?: string[];
  component?: string;
  valueSource?: string;
  identifiers?: string[];
  links?: (JsSchema & { rel: string, href: string })[];*/
}
