describe('Search and Select Body Part', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/exercises/bodyPartList').as('getBodyPartList');
    cy.intercept('GET', '**/exercises?limit=1000&offset=0').as('getExercises');

    cy.visit('http://localhost:3000');
    cy.wait('@getBodyPartList');
    cy.wait('@getExercises');
  });

  it('should search for exercises based on body part input', () => {
    cy.get('[data-testid="search-input"]').should('exist').type('arms');
    cy.get('[data-testid="search-button"]').should('exist').click();

    // Ensure exercise cards are loaded
    cy.get('[data-testid="exercise-card"]', { timeout: 10000 }).should('exist');

    // Check each exercise card for "Arms" text
    cy.get('[data-testid="exercise-card"]')
      .should('have.length.greaterThan', 0)
      .each(($card) => {
        cy.wrap($card).within(() => {
          // Use `cy.contains` directly instead of `cy.find`
          cy.contains(/Arms/i).should('exist');
        });
      });
  });
});
