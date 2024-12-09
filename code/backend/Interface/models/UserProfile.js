const { getAvatar } = require('../controllers/UserProfileControllers');
const SQL = require('../utils/SQL');

updateProfile = (user_id, profileData) => {
  const {
    first_name,
    last_name,
    avatar_url,
    introduction,
    height,
    weight,
    fitness_level,
    fitness_goals,
    birthday,
    training_start_date,
    phone,
    Email,
    country,
    city,
    state
  } = profileData;

  const sql = `
    UPDATE user_profile 
    SET 
      First_name = ?, 
      Last_name = ?, 
      avatar_url = ?, 
      introduction = ?, 
      height = ?, 
      weight = ?, 
      fitness_level = ?, 
      fitness_goals = ?, 
      birthday = ?, 
      training_start_date = ?, 
      phone = ?, 
      Email = ?, 
      country = ?, 
      city = ?, 
      state = ? 
    WHERE 
      user_id = ?
  `;

  const values = [
    first_name, last_name, avatar_url, introduction, height, weight, fitness_level, fitness_goals,
    birthday, training_start_date, phone, Email, country, city, state, user_id
  ];

  // TODO: add more res detail
  return SQL.runsql(sql, values)
            .then((result)=>{
              if(result.rows.affectedRows == 0){
                return {"err":"Profile updated fail"};
              }
              return {"massage":"Profile updated successfully"};
            },(err) => err);
}

createProfile = (user_id, profileData) => {
  const {
    first_name,
    last_name,
    avatar_url,
    introduction,
    height,
    weight,
    fitness_level,
    fitness_goals,
    birthday,
    training_start_date,
    phone,
    Email,
    country,
    city,
    state
  } = profileData;

  const sql = `
    INSERT INTO user_profile (
      user_id, First_name, Last_name, avatar_url, introduction, height, weight, fitness_level, fitness_goals,
      birthday, training_start_date, phone, Email, country, city, state
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id, first_name, last_name, avatar_url, introduction, height, weight, fitness_level, fitness_goals,
    birthday, training_start_date, phone, Email, country, city, state
  ];
  
  return SQL.runsql(sql, values)
            .then((result)=>{
              if(result.rows.affectedRows == 0){
                return {"err":"Profile updated fail"};
              }
              return {"massage":"Profile updated successfully"};
            },(err) => err);
}

getProfile = (user_id) => {
  const sql = `
    SELECT 
      First_name, Last_name, avatar_url, introduction, height, weight, fitness_level, 
      fitness_goals, birthday, training_start_date, phone, Email, country, city, state 
    FROM 
      user_profile 
    WHERE 
      user_id = ?
  `;

  const values = [user_id];

  return SQL.runsql(sql, values)
            .then((result)=>{
              return result.rows[0];
            },(err) => err);
}


module.exports =  {updateProfile, getProfile, createProfile}