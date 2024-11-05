describe('template spec', () => {
  it('should accept new account register - POST Request', () => {
    cy.request({
      method: 'POST',
      url: `/api/account`, 
      body: {
        email : "test@email.com",
        name : "test",
        password : "password"
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
    });
  });

  it('should denied same account register again - POST Request', () => {
    cy.request({
      method: 'POST',
      url: `/api/account`, 
      body: {
        email : "test@email.com",
        name : "test",
        password : "password"
      },
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("err","user name or email already exist");
    });
  });

})