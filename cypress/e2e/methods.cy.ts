const methods = [{
  method: 'HEAD',
  color: 'rgb(237, 187, 74)'
},
{
  method: 'GET',
  color: 'rgb(100, 112, 243)'
},
{
  method: 'POST',
  color: 'rgb(31, 169, 113)'
},
{
  method: 'PUT',
  color: 'rgb(31, 169, 113)'
},
{
  method: 'PATCH',
  color: 'rgb(219, 121, 5)'
},
{
  method: 'DELETE',
  color: 'rgb(255, 87, 112)'
}]

it(`works with basic methods`, () => {

  methods.forEach(({ method, color }, i) => {
    cy.api({
      method,
      url: '/'
    })

    cy.get('[data-cy=method]')
      .eq(i)
      .should('have.css', 'color', color)

  });

})

