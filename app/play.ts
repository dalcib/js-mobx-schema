import { autorun, computed, extendObservable, observable, toJS } from 'mobx'
import { schema } from './decorator'
import { JsonSchema } from './JsonSchema'

class FormDatas {
  static schema: JsonSchema = {}
  @schema({ minLength: 5 })
  firstName: string
  @schema({ maxLength: 5 })
  lastName: string
  @schema({ format: 'email' })
  email: string
  @schema({ title: 'title' })
  acceptTerms: boolean = false
  errors: any
  @computed
  get valid() {
    // this becomes a computed() property
    return this.errors === null
  }
  //'date | 'time' | 'date-time' | 'uri' | 'url' | 'url-template' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'regex' | 'uuid' | 'json-pointer' | 'relative-json-pointer' | string
  constructor() {
    extendObservable(this, { errors: null })
    extendObservable(this, { firstName: undefined })
    extendObservable(this, { lastName: undefined })
    extendObservable(this, { email: undefined })
    extendObservable(this, { acceptTerms: undefined })
    extendObservable(this, { acceptTerms: undefined })
    this.setupValidation() // We will look at this below
  }

  setupValidation() {
    autorun(() => {
      // Dereferencing observables for tracking
      //const { firstName, email, acceptTerms } = this
      //const props = { firstName, email, acceptTerms }
      this.errors = this.runValidation(this)
    })
  }

  runValidation(propertyMap: any) {
    const { firstName, lastName, email, acceptTerms } = propertyMap
    const isValid =
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      acceptTerms === true
    return isValid ? null : { error: 'error' }
  }
}

const instance = new FormDatas()

// Simple console logger
autorun(() => {
  // tracking this so autorun() runs for every input change
  const validation = instance.errors

  console.log(`Valid = ${instance.valid}`)
  if (instance.valid) {
    console.log('--- Form Submitted ---')
  }
})

console.log(FormDatas.schema)

// Let's change the fields
instance.firstName = 'Pavan'
instance.lastName = 'Podila'
instance.email = 'pavan@pixelingene.com'
instance.acceptTerms = true
