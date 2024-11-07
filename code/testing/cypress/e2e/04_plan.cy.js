describe('Workout Plan API Tests', () => {
  let userId;
  let planId;
  let exerciseId;
  const testUser = {
    name: `test_${Date.now()}`, // Unique username to avoid conflicts
    password: 'password',
    email: `test_${Date.now()}@test.com`
  };

  const cleanupTestData = () => {
    // Chain the cleanup operations
    if (!userId) return;

    cy.then(() => {
      // First clean up plan if it exists
      if (planId) {
        return cy.request({
          method: 'DELETE',
          url: `/api/plan/${planId}`,
          headers: {
            'x-user-id': userId
          },
          failOnStatusCode: false,
          timeout: 10000
        });
      }
    }).then(() => {
      // Then clean up exercise
      if (exerciseId) {
        return cy.request({
          method: 'DELETE',
          url: `/api/exercise/${exerciseId}`,
          headers: {
            'x-user-id': userId
          },
          failOnStatusCode: false,
          timeout: 10000
        });
      }
    }).then(() => {
      // Finally clean up user account
      return cy.request({
        method: 'DELETE',
        url: '/api/account',
        qs: { token: userId },
        headers: {
          'Content-Type': 'application/json',
        },
        failOnStatusCode: false,
        timeout: 10000
      });
    });
  };

  before(() => {
    // Create test user account
    cy.request({
      method: 'POST',
      url: '/api/account',
      body: testUser,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');

      // Login to get user token
      return cy.request({
        method: 'GET',
        url: '/api/account',
        qs: {
          name: testUser.name,      
          password: testUser.password
        }
      });
    }).then((response) => {
      userId = response.body.token;

      // Create an exercise to use in plans
      return cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Test Exercise',
          type: 'strength',
          description: 'Test exercise for plans',
          equipment: 'none',
          reps: 10,
          sets: 3
        }
      });
    }).then((response) => {
      exerciseId = response.body.data.insertId;
    });
  });

  it('should validate required fields when creating plan', () => {
    cy.request({
      method: 'POST',
      url: '/api/plan',
      headers: {
        'x-user-id': userId
      },
      body: {
        description: 'Missing required fields'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.err).to.include('Missing required field');
    });
  });

  it('should create a new workout plan', () => {
    cy.request({
      method: 'POST',
      url: '/api/plan',
      headers: {
        'x-user-id': userId
      },
      body: {
        exercise_id: exerciseId,
        name: 'Test Plan',
        description: 'Test workout plan',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        target_sets: 3,
        target_reps: 10,
        frequency_type: 'weekly',
        frequency_value: 3,
        days_of_week: 'monday,wednesday,friday',
        preferred_time: '08:00:00',
        priority: 5
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('msg', 'Plan created successfully');
      expect(response.body.data).to.have.property('insertId');
      planId = response.body.data.insertId;
      // Verify plan was created by getting it
      cy.request({
        method: 'GET',
        url: `/api/plan/${planId}`,
        headers: {
          'x-user-id': userId
        }
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body).to.have.property('name', 'Test Plan');
      });
    });
  });

  it('should validate status update', () => {
    cy.request({
      method: 'PATCH',
      url: `/api/plan/${planId}/status`,
      headers: {
        'x-user-id': userId
      },
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('err', 'Status is required');
    });
  });

  it('should get active plans for specific date', () => {
    const testDate = '2024-01-15';
    cy.request({
      method: 'GET',
      url: '/api/plan/active',
      qs: { date: testDate },
      headers: {
        'x-user-id': userId
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should prevent access to other users plans', () => {
    // Create another user and their plan first
    const otherUser = {
      name: `test_other_${Date.now()}`,
      password: 'password',
      email: `test_other_${Date.now()}@test.com`
    };

    let otherUserId;
    let otherPlanId;

    // Create other user
    cy.request({
      method: 'POST',
      url: '/api/account',
      body: otherUser,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      return cy.request({
        method: 'GET',
        url: '/api/account',
        qs: {
          name: otherUser.name,      
          password: otherUser.password
        }
      });
    }).then((response) => {
      otherUserId = response.body.token;
      
      // Create a plan for other user
      return cy.request({
        method: 'POST',
        url: '/api/plan',
        headers: {
          'x-user-id': otherUserId
        },
        body: {
          exercise_id: exerciseId,
          name: 'Other User Plan',
          description: 'Test plan',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          frequency_type: 'weekly',
          frequency_value: 3
        }
      });
    }).then((response) => {
      otherPlanId = response.body.data.insertId;

      // Try to access other user's plan
      return cy.request({
        method: 'GET',
        url: `/api/plan/${otherPlanId}`,
        headers: {
          'x-user-id': userId
        },
        failOnStatusCode: false
      });
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.body).to.have.property('err', 'Access denied');

      // Clean up other user
      return cy.request({
        method: 'DELETE',
        url: '/api/account',
        qs: { token: otherUserId },
        headers: {
          'Content-Type': 'application/json',
        },
        failOnStatusCode: false
      });
    });
  });

  after(() => {
    cleanupTestData();
  });
});