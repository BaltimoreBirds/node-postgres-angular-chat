var Schema = {
  users: {
    id: {type: 'increments', nullable: false, primary: true},
    provider: {type: 'string', maxlength: 150, nullable: false},
    password: {type: 'string', maxlength: 25, nullable: false},
    username: {type: 'string', maxlength: 150, nullable: false},
    status: {type: 'string', maxlength: 150, nullable: false},
    last_login: {type: 'timestamp', maxlength: 150, nullable: false},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false},
  },
  messages: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer',nullable: false, unsigned: true},
    chat_id: {type: 'integer',nullable: false, unsigned: true},
    text: {type: 'string', maxlegnth: 300, nullable: false},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false}
  },
  //users have a name profile
  names: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    familyName:{ type: 'string', maxlength:150, nullable: false}, //last
    givenName:{ type: 'string', maxlength:150, nullable: false},  //first
    middleName:{ type: 'string', maxlength:150, nullable: true},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false}  //middle
  },
  // users have many emails
  emails: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    value: { type:'string', maxlength:150,nullable:false}, 
    type: {type: 'string',maxlength:150,nullable:true},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false}
  },
  //users have many photos
  photos:{
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    value: {type: 'string', maxlength:150, nullable: true},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false}
  },
  //Has and belongs to many users, through chats_users, 
  //Has and belongs to many messages, through chats_messages
  chats:{
    id: {type: 'increments', nullable: false, primary: true},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false} 
  },
  // chats_messages:{
  //   id: {type: 'increments', nullable: false, primary: true},
  //   chat_id: {type: 'integer', nullable: false, unsigned: true},
  //   message_id: {type: 'integer', nullable: false, unsigned: true},
  //   created_at: {type: 'timestamp', maxlength: 150, nullable: false},
  //   updated_at: {type: 'timestamp', maxlength: 150, nullable: false}    
  // },
  //Join table for chats and users many to many 
  chats_users: {
    id: {type: 'increments', nullable: false, primary: true},
    user_id: {type: 'integer', nullable: false, unsigned: true},
    chat_id: {type: 'integer', nullable: false, unsigned: true},
    created_at: {type: 'timestamp', maxlength: 150, nullable: false},
    updated_at: {type: 'timestamp', maxlength: 150, nullable: false}
  }
};
module.exports = Schema;