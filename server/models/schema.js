var Schema = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    provider: {type: 'string', maxlength: 150, nullable: false},
    displayName: {type: 'string', maxlength: 150, nullable: false},
  },
  //users have a name profile
  name: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    familyName:{ type: 'string', maxlength:150, nullable: false}, //last
    givenName:{ type: 'string', maxlength:150, nullable: false},  //first
    middleName:{ type: 'string', maxlength:150, nullable: true},  //middle
  },
  // users have many emails
  emails: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    value: { type:'string', maxlength:150,nullable:false}, 
    type: {type: 'string',maxlength:150,nullable:true},
  },
  //users have many photos
  photos:{
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    value: {type: 'string', maxlength:150, nullable: true},
  }
};
module.exports = Schema;