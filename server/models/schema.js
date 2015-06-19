var Schema = {
  users: {
    id: {type: 'serial', nullable: false, primary: true},
    provider: {type: 'string', maxlength: 150, nullable: false},
    displayName: {type: 'string', maxlength: 150, nullable: false},
    name: {
      familyName:{ type: 'string', maxlength:150, nullable: false}, //last
      givenName:{ type: 'string', maxlength:150, nullable: false},  //first
      middleName:{ type: 'string', maxlength:150, nullable: true}   //middle
    },
    emails: {
      value: { type:'string', maxlength:150,nullable:false}, 
      type: {type: 'string',maxlength:150,nullable:true},
      "default": []
    },
    photos:{
        value: {type: 'string', maxlength:150, nullable: true},
        "default": []
    }
  }
};
module.exports = Schema;