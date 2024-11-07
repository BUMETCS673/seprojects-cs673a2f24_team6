describe('Registration Test', () => {
  it('registers a new user', () => {
    cy.visit('/register');
    cy.get('.registration-container').should('be.visible'); 
    cy.get('input[placeholder="Your Email Address"]').type('newuser1@example.com');
    cy.get('input[placeholder="Your Username"]').type('newuser1');
    cy.get('input[placeholder="Your Password"]').type('password1234');
    cy.get('.submit-button').click();
    
    cy.url().should('include', '/');
  });
  
});
