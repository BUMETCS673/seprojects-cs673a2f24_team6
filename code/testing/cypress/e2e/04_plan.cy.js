describe('Workout Plan API Tests', () => {
  let token = '';
  let adminToken = '';
  let planId;
  let exerciseId;
  
  const testUser = {
    name: `test_${Date.now()}`,
    password: 'password',
    email: `test_${Date.now()}@test.com`
  };

  const testPlan = {
    title: 'Weekly Strength Training',
    description: 'Basic strength training routine',
    frequency_type: 'weekly',
    days_of_week: 'monday,wednesday,friday',
    time_of_day: '08:00:00',
    priority: 5,
    status: true,
    reminder_enabled: true
  };

  before(() => {
    // Login as admin first
    cy.request({
      method: 'GET',
      url: '/api/account',
      qs: {
        name: 'admin',
        password: 'admin'
      }
    }).then((adminLoginResponse) => {
      expect(adminLoginResponse.status).to.eq(200);
      adminToken = adminLoginResponse.body.token;
      
      // Create test exercise as admin
      return cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': adminToken,
        },
        body: {
          name: 'Test Exercise',
          type: 'strength',
          description: 'Test exercise for workout plan',
          equipment: 'none',
          url: 'https://example.com/exercise'
        }
      });
    }).then((exerciseResponse) => {
      expect(exerciseResponse.status).to.eq(200);
      expect(exerciseResponse.body).to.have.property('massage', 'exercise create successfully');
      
      // Get exercise ID
      return cy.request({
        method: 'GET',
        url: '/api/exercise'
      });
    }).then((getExerciseResponse) => {
      const exercise = getExerciseResponse.body.find(e => e.name === 'Test Exercise');
      exerciseId = exercise.exercise_id;
      testPlan.exercise_id = exerciseId;

      // Create regular test user
      return cy.request({
        method: 'POST',
        url: '/api/account',
        body: testUser,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).then((response) => {
      expect(response.status).to.eq(200);
      
      // Login as test user
      return cy.request({
        method: 'GET',
        url: '/api/account',
        qs: {
          name: testUser.name,      
          password: testUser.password
        }
      });
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      token = loginResponse.body.token;
    });
  });

  describe('Plan Creation', () => {
    it('should create new workout plan', () => {
      cy.request({
        method: 'POST',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        body: testPlan
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('massage', 'Plan upload successfully');
      });
    });

    it('should fail to create plan without required status field', () => {
      const invalidPlan = {
        exercise_id: exerciseId,
        title: 'Invalid Plan',
        frequency_type: 'daily'
        // Missing status field
      };

      cy.request({
        method: 'POST',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        body: invalidPlan,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('err', 'Missing required field: status');
      });
    });

    it('should fail to create plan with invalid exercise_id', () => {
      const invalidPlan = {
        ...testPlan,
        exercise_id: 99999 // Non-existent exercise ID
      };

      cy.request({
        method: 'POST',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        body: invalidPlan,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('err', 'No such execise id');
      });
    });
  });

  describe('Plan Retrieval', () => {
    it('should get all user workout plans', () => {
      cy.request({
        method: 'GET',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('rows');
        expect(response.body.rows).to.be.an('array');
        
        const plan = response.body.rows.find(p => 
          p.title === testPlan.title &&
          p.exercise_id === exerciseId
        );
        expect(plan).to.exist;
        planId = plan.plan_id;

        // Verify plan details
        expect(plan).to.deep.include({
          title: testPlan.title,
          description: testPlan.description,
          exercise_id: testPlan.exercise_id,
          frequency_type: testPlan.frequency_type,
          days_of_week: testPlan.days_of_week,
          time_of_day: testPlan.time_of_day,
          priority: testPlan.priority,
          status: testPlan.status ? 1 : 0,
          reminder_enabled: testPlan.reminder_enabled ? 1 : 0
        });
      });
    });
  });

  describe('Plan Updates', () => {
    it('should update workout plan', () => {
      const updatedPlan = {
        plan_id: planId,
        exercise_id: exerciseId,
        title: 'Updated Training Plan',
        description: 'Modified training routine',
        frequency_type: 'daily',
        time_of_day: '09:00:00',
        priority: 7,
        status: true,
        reminder_enabled: false
      };

      cy.request({
        method: 'PUT',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        body: updatedPlan
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('massage', 'Plan updated successfully');

        // Verify update
        return cy.request({
          method: 'GET',
          url: '/api/plan',
          headers: {
            'x-user-id': token,
          }
        });
      }).then((getResponse) => {
        const plan = getResponse.body.rows.find(p => p.plan_id === planId);
        expect(plan).to.exist;
        expect(plan.title).to.equal(updatedPlan.title);
        expect(plan.frequency_type).to.equal(updatedPlan.frequency_type);
      });
    });

    it('should fail to update plan without status', () => {
      const invalidUpdate = {
        plan_id: planId,
        title: 'Invalid Update'
        // Missing status field
      };

      cy.request({
        method: 'PUT',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        body: invalidUpdate,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('err', 'Missing required field: status');
      });
    });

    it('should fail to update plan without plan_id', () => {
      const invalidUpdate = {
        title: 'Invalid Update',
        status: true
        // Missing plan_id
      };

      cy.request({
        method: 'PUT',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        body: invalidUpdate,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('err', 'Missing required field: plan_id');
      });
    });
  });

  describe('Plan Deletion', () => {
    it('should delete workout plan', () => {
      cy.request({
        method: 'DELETE',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        qs: {
          plan_id: planId
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('massage', 'Plan delete successfully');

        // Verify deletion
        return cy.request({
          method: 'GET',
          url: '/api/plan',
          headers: {
            'x-user-id': token,
          }
        });
      }).then((getResponse) => {
        const plan = getResponse.body.rows.find(p => p.plan_id === planId);
        expect(plan).to.not.exist;
      });
    });

    it('should fail to delete non-existent plan', () => {
      cy.request({
        method: 'DELETE',
        url: '/api/plan',
        headers: {
          'x-user-id': token,
        },
        qs: {
          plan_id: 99999 // Non-existent plan ID
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('err', 'Plan delete fail');
      });
    });
  });
});