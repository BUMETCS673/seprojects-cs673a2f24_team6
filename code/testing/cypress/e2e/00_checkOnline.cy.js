describe('template spec', () => {
  it('should check the backend online - GET Request', () => {
    cy.request({
      method: 'GET',
      url: `/`, 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('test','success'); 
    });
  });
})