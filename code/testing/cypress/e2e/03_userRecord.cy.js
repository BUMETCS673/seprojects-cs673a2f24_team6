describe('template spec', () => {
  let token = '';
  let record = 0;

  it('should login and get token first - GET Request', () => {
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

  it('should add new record with token - POST Request', () => {
    cy.request({
      method: 'POST',
      url: `/api/record`, 
      body: {
        token: token,
        exercise_name: "Testing",
        description: "Upper body strength exercise",
        number_of_set: 8,
        status: "todo",
        priority: 1,
        start_time: "2024-10-16 10:00:00",
        end_time: "2024-10-16 10:30:00",
        total_time: 30
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('rows');
      record = response.body.rows.insertId;
    });
  });

  it('should get the record of the user - GET Request', () => {
    cy.request({
      method: 'GET',
      url: `/api/record`,
      qs: {
        token: token
      },
      headers: {
        'Content-Type': 'application/json',
      }, 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('rows');
      expect(response.body.rows.length).to.greaterThan(0);
    });
  });

  it('should update record with token - PUT Request', () => {
    cy.request({
      method: 'PUT',
      url: `/api/record`, 
      body: {
        token: token,
        record_id:record,
        exercise_name: "Testing modify",
        description: "Upper body strength exercise",
        number_of_set: 8,
        status: "todo",
        priority: 1,
        start_time: "2024-10-16 10:00:00",
        end_time: "2024-10-16 10:30:00",
        total_time: 30
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('rows');
      expect(response.body.rows.affectedRows).to.eq(1);
    });
  });

  it('should remove the record of the user - DELETE Request', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/record`,
      qs: {
        token: token,
        record_id: record
      },
      headers: {
        'Content-Type': 'application/json',
      }, 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('rows');
      expect(response.body.rows.affectedRows).to.eq(1);
    });
  });

})