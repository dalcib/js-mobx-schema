import * as React from 'react'
import Model from './model'
import ClassSchemaExample from './example'
import * as ReactTestRenderer from 'react-test-renderer'
import { observer } from 'mobx-react'

//jest.mock('mobx-react', () => require('mobx-react/custom'))

type ObjectFields<T> = { [P in keyof T]: T[P] }

const f = new Model(ClassSchemaExample)
const l = f.l

const Comp = observer(() =>
  <div>
    <input {...l('name')} />
    {JSON.stringify(f.errorsMessages)}
    {f.errorsText}
  </div>
)

//{JSON.stringify(f.errors)}

const CompOb = (
  <div>
    <Comp />
  </div>
)

const renderer = ReactTestRenderer.create(CompOb)

describe('component', () => {
  it('test renderer', () => {
    expect(renderer).toMatchSnapshot()
    f.data.name = 'aaaaa'
    expect(renderer).toMatchSnapshot()
    f.data.firstName = 'aa'
    expect(renderer).toMatchSnapshot()
    f.data.firstName = 'aacccccc'
    expect(renderer).toMatchSnapshot()
  })
})
