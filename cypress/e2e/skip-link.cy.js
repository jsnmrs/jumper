describe('skip link', () => {
  it('passes', () => {
    // Load the page
    cy.visit('/')

    // Ensure the skip link is not visible
    cy.get('.skip').as('skipLink').should('not.be.visible')

    // Press Tab to enter the page
    cy.window().focus().realPress('Tab')

    // Ensure the skip link is focused and visible
    cy.get('@skipLink').should('have.focus').and('be.visible')

    // Activate skip link
    cy.get('@skipLink').realPress('Enter')

    // Ensure the skip link is not focused or visible
    cy.get('@skipLink').should('not.have.focus').and('not.be.visible')

    // Ensure the skip link target is focused and visible
    cy.get('#content').as('skipTarget').should('have.focus').and('be.visible')
  })
})
