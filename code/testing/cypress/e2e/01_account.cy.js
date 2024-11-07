describe('User Account Management Tests', () => {
  const testUser = {
    email: 'test@email.com',
    name: 'testuser',
    password: 'password123'
  };
  let userId;

  it('should create a new account', () => {
    cy.request({
      method: 'POST',
      url: '/api/account',
      body: testUser
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      userId = response.body.token;
    });
  });

  it('should prevent duplicate account creation', () => {
    cy.request({
      method: 'POST',
      url: '/api/account',
      body: testUser,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('err', 'user name or email already exist');
    });
  });

  it('should login successfully', () => {
    cy.request({
      method: 'GET',
      url: '/api/account',
      qs: {
        name: testUser.name,
        password: testUser.password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
    });
  });

  it('should reject invalid login credentials', () => {
    cy.request({
      method: 'GET',
      url: '/api/account',
      qs: {
        name: testUser.name,
        password: 'wrongpassword'
      },
      failOnStatusCode:false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('err', 'password error');
    });
  });

  it('should require password for account deletion', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/account',
      headers: {
        'x-user-id': userId
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('err', 'Password is required');
    });
  });

  it('should not allow account deletion with incorrect password', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/account',
      headers: {
        'x-user-id': userId
      },
      body: {
        password: 'wrongpassword'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('err', 'Invalid password');
    });
  });

  it('should delete account and verify no subsequent access', function() {
    let deletedUserId;
    const deleteTestUser = {
      email: 'delete@test.com',
      name: 'deletetest',
      password: 'password123'
    };

    // First create an account to delete
    cy.request({
      method: 'POST',
      url: '/api/account',
      body: deleteTestUser
    }).then((response) => {
      expect(response.status).to.eq(200);
      deletedUserId = response.body.token;

      // Then delete the account
      cy.request({
        method: 'DELETE',
        url: '/api/account',
        headers: {
          'x-user-id': deletedUserId
        },
        body: {
          password: deleteTestUser.password
        }
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body).to.have.property('msg', 'Account deleted successfully');

        // Finally verify can't login
        cy.request({
          method: 'GET',
          url: '/api/account',
          qs: {
            name: deleteTestUser.name,
            password: deleteTestUser.password
          },
          failOnStatusCode: false
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(401);
          expect(loginResponse.body).to.have.property('err', 'no such user');
        });
      });
    });
  });

  it('should return 404 when trying to delete non-existent account', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/account',
      headers: {
        'x-user-id': '99999'
      },
      body: {
        password: 'anypassword'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('err', 'Account not found');
    });
  });

  // Clean up main test user
  after(() => {
    if (userId) {
      cy.request({
        method: 'DELETE',
        url: '/api/account',
        headers: {
          'x-user-id': userId
        },
        body: {
          password: testUser.password
        },
        failOnStatusCode: true
      });
    }
  });
});