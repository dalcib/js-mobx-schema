interface Data {
  [key: string]: any
}

const data: Data = /*observable(*/ { name: 'asd', car: 'sdfs' } //)

const handleChange = (field: string, value: string) => {
  data[field] = value
}

function b(field: string) {
  return {
    value: data[field],
    onChange: ((e: any) => {
      handleChange(field, e.target.value)
    }) //as React.EventHandler<MyFormEvent<HTMLInputElement>>,
  }
}

export const bindField = (
  form: any,
  field: string,
  onChangeFn: () => void,
  {
    error = 'error',
    value = 'value',
    //label
    //onChangeFn,
    onChange = 'onChange',
    placeholder = 'placeholder',
  } = {}
) => ({
  name: form.$(field).name,
  [value]: form.$(field).value,
  [placeholder]: form.$(field).label,
  [onChange]: onChangeFn || form.$(field).sync,
  [error]: form.$(field).error,
})

interface MyEventTarget extends EventTarget {
  value: string
  checked?: boolean
  type?: string
  [key: string]: any
}

/* interface MyFormEvent<T> extends React.FormEvent<T> {
  target: MyEventTarget
} */
interface FormEvent {
  target: MyEventTarget
}

export const bindFieldx = (
  field: any,
  {
    changeEvent = 'onChange',
    targetProperty = 'value',
    valueKey = 'value' /*, afterSet*/,
  } = {}
) => ({
  /* onBlur: () => {
    field.markAsFocused(false)
  },
  onFocus: () => {
    field.markAsFocused(true)
  }, */
  [changeEvent]: ((e: FormEvent | string): void => {
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
    field.value = newValue
  }), //as React.EventHandler<MyFormEvent<HTMLInputElement>>,
  [valueKey]: field.value,
})

export const autofocus = { ref: (elem: any) => elem !== null && elem.focus() }

export const onEnter = (cb: any) => ({
  onKeyPress: (e: any) => {
    const { key, target: { value }, shiftKey } = e
    if (key === 'Enter' && !shiftKey) {
      e.preventDefault()
      cb(value)
    }
  },
})