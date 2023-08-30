describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('localhost:8100')

    cy.get('ion-input')
        .find('input') // Assuming the input field is a child of the ion-input component
        .type('Troy')
        .should('have.value', 'Troy')

    cy.get('ion-input')
        .find('input')
        .clear()
        .should('have.value', '');
    // cy.contains('Welcome to Example')
    // cy.get('ion-input[data-testid="input-element"]').type('troy')

    // Simulate hitting the Enter key to trigger the search
    // cy.get('ion-input[data-testid="search-input"]').type('{enter}')

    // cy.contains('root', 'Ready to create an app?')
  })
})