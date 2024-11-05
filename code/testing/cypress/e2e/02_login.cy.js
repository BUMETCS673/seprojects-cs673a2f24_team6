describe('template spec', () => {
  let token = '';

  it('should login and get token after register - GET Request', () => {
    cy.request({
      method: 'GET',
      url: `/api/account`,
      qs: {
        name: 'test',      
        password: 'password'
      },
      headers: {
        'Content-Type': 'application/json',
      }, 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token'); 
      token = response.body.token
    });
  });

  it('should denied login with wrong password - GET Request', () => {
    cy.request({
      method: 'GET',
      url: `/api/account`,
      qs: {
        name: 'test',      
        password: 'wrongpassword'
      },
      headers: {
        'Content-Type': 'application/json',
      }, 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("err", "password error");
    });
  });

})