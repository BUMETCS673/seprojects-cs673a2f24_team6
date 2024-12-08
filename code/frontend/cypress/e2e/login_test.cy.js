describe('Login Page', () => {
  it('should login successfully with valid credentials', () => {

    cy.intercept('GET', '/api/account*', (req) => {
      req.reply({
        statusCode: 200,
        body: { token: 'dynamic_token_value' },  
      });
    }).as('loginRequest');
    
    cy.visit('/');
    cy.contains('Login').click();
    
    cy.get('input').eq(0).type('ppp@ppp.com');   // valid email + pwd
    cy.get('input').eq(1).type('ppp');
    
    cy.get('.login-button').click();
    
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.body).to.have.property('token');  // check keyword "token"
    });
    
    cy.window().then((window) => {
      const storedToken = window.localStorage.getItem('token');
      expect(storedToken).to.exist;
    });

    //cy.url().should('include', '/welcome');
  });
});
