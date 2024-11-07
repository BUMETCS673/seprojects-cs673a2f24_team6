describe('Exercise API Tests', () => {
  let userId;
  let exerciseId;
  let systemExerciseId;
  const testUser = {
    name: `test_${Date.now()}`, // Unique username to avoid conflicts
    password: 'password',
    email: `test_${Date.now()}@test.com`
  };

  // Create test user and exercise before ALL tests
  before(() => {
    // Create and login test user first
    return cy.request({
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
      
      // Create initial test exercise
      return cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Push-ups',
          type: 'strength',
          description: 'Basic push-up exercise',
          equipment: 'none',
          reps: 10,
          sets: 3,
          duration: 0,
          is_system: false
        }
      });
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('msg', 'Exercise created successfully');
      expect(response.body.data).to.have.property('insertId');
      exerciseId = response.body.data.insertId;
    });
  });

  // Cleanup after ALL tests
  after(() => {
    if (userId) {
      // Ensure cleanup runs in order
      cy.request({
        method: 'DELETE',
        url: `/api/exercise/${exerciseId}`,
        headers: {
          'x-user-id': userId
        },
        failOnStatusCode: false
      }).then(() => {
        return cy.request({
          method: 'DELETE',
          url: '/api/account',
          qs: { token: userId },
          headers: {
            'Content-Type': 'application/json',
          },
          failOnStatusCode: false
        });
      });
    }
  });

  describe('Exercise Creation and Validation', () => {
    it('should validate required fields when creating exercise', () => {
      cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': userId
        },
        body: {
          description: 'Missing required fields'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message', 'Name and type are required');
      });
    });

    it('should create a new exercise', () => {
      // Create a second exercise
      cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Squats',
          type: 'strength',
          description: 'Basic squat exercise',
          equipment: 'none',
          reps: 12,
          sets: 3,
          duration: 0,
          is_system: false
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('msg', 'Exercise created successfully');
        expect(response.body.data).to.have.property('insertId');
      });
    });
  });

  describe('Exercise Updates and Retrieval', () => {
    it('should update user exercise with valid fields', () => {
      cy.request({
        method: 'PUT',
        url: `/api/exercise/${exerciseId}`,
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Modified Push-ups',
          type: 'strength',
          description: 'Modified push-up exercise',
          reps: 15,
          sets: 4
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('msg', 'Exercise updated successfully');
        
        // Verify the updates
        return cy.request({
          method: 'GET',
          url: `/api/exercise/${exerciseId}`,
          headers: {
            'x-user-id': userId
          }
        });
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body).to.have.property('name', 'Modified Push-ups');
        expect(getResponse.body).to.have.property('description', 'Modified push-up exercise');
        expect(getResponse.body).to.have.property('reps', 15);
        expect(getResponse.body).to.have.property('sets', 4);
        expect(getResponse.body).to.have.property('type', 'strength');
      });
    });

    it('should fail to update non-existent exercise', () => {
      cy.request({
        method: 'PUT',
        url: '/api/exercise/99999',
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Modified Push-ups',
          type: 'strength'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('err', 'Exercise not found');
      });
    });

    it('should get all exercises', () => {
      console.log(userId);
      cy.request({
        method: 'GET',
        url: '/api/exercise',
        headers: {
          'x-user-id': userId
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.at.least(1);
        
        // Store system exercise if found
        const systemExercise = response.body.find(ex => ex.user_id === null);
        if (systemExercise) {
          systemExerciseId = systemExercise.exercise_id;
        }
      });
    });
  });

  describe('System Exercise Tests', () => {
    it('should fail to update system exercise', function() {
      if (!systemExerciseId) {
        this.skip();
      }
      
      cy.request({
        method: 'PUT',
        url: `/api/exercise/${systemExerciseId}`,
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Try modify system exercise',
          type: "strength"
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.have.property('err', 'Cannot modify system exercises');
      });
    });

    it('should clone a system exercise', function() {
      if (!systemExerciseId) {
        this.skip();
      }
      
      cy.request({
        method: 'POST',
        url: `/api/exercise/${systemExerciseId}/clone`,
        headers: {
          'x-user-id': userId
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('msg', 'Exercise cloned successfully');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('insertId');
      });
    });
  });

  describe('Exercise Deletion', () => {
    it('should delete user-created exercise', () => {
      // Create a temporary exercise to delete
      let tempExerciseId;
      
      cy.request({
        method: 'POST',
        url: '/api/exercise',
        headers: {
          'x-user-id': userId
        },
        body: {
          name: 'Temp Exercise',
          type: 'strength',
          description: 'Temporary exercise for deletion test',
          equipment: 'none',
          reps: 10,
          sets: 3
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        tempExerciseId = response.body.data.insertId;
        
        // Delete the temporary exercise
        return cy.request({
          method: 'DELETE',
          url: `/api/exercise/${tempExerciseId}`,
          headers: {
            'x-user-id': userId
          }
        });
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('msg', 'Exercise deleted successfully');

        // Verify exercise is deleted
        cy.request({
          method: 'GET',
          url: `/api/exercise/${tempExerciseId}`,
          headers: {
            'x-user-id': userId
          },
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(404);
          expect(getResponse.body).to.have.property('err', 'Exercise not found');
        });
      });
    });
  });
});