describe('Login Page', () => {
    it('Page should show error message will wrong email/pwd', () => {
      cy.visit('/');
      cy.contains('Login').click();
      cy.get('input').eq(0).type('wrong@email.com');  // invalid email and pwd
      cy.get('input').eq(1).type('wrong');
  
      cy.get('.login-button').click();
  
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Invalid email or password');
      });

      ////cy.url().should('include', '/login');

    });
  });