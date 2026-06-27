import { transform } from '../../src/modules/transform'

describe('transform() plaintext escaping', () => {
  it('escapes HTML when Prism language is missing (plaintext)', () => {
    const payload = '"</code><script>alert(1)</script>"'

    const output = transform(payload, 'plaintext')

    expect(output).to.contain('<code')
    expect(output).to.contain('&lt;/code&gt;')
    expect(output).to.contain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(output).to.not.contain('<script>')
    expect(output).to.not.contain('</code><script>')
  })
})
