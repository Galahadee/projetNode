import mongoose from "mongoose";


const usersSchema=new mongoose.Schema({
  _id: {type: mongoose.SchemaTypes.ObjectId,required: true,default: () => new mongoose.Types.ObjectId(),},
  firstName  :{ type: String, required: true },
  lastName :{ type: String, required: true },
  email  :{ type: String, required: true },
  password  :{ type: String, required: true }
})


const collectionName = 'users'
const UsersModel = mongoose.model('Users', usersSchema, collectionName)

export default UsersModel