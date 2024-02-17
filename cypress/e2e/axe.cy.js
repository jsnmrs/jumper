describe('Home', () => {
  it('should be accessible', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag22aaa', 'best-practice', 'experimental']
      }
    })
  })
})
