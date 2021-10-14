import mongoose from 'mongoose'
import { Password } from '../submodules/password'

// For ts usage.
// A wholely comstomed interface,
// that describes the properties
// that are required to create a User Schema.
interface UserAttrs {
  email: string
  password: string
}

// For ts usage.
// An interface extends Document class of mongoose,
// that describes the properties
// that a single User Document instance has, 
// including the additional properties 
// that added by mongoose build -in mechanism.
interface UserDoc extends mongoose.Document {
  email: string
  password: string
  // createdAt: string
  // updatedAt: string
}

// For ts usage.
// An interface that extends Model class of nongoose,
// that describe the properties
// that are required to create a User Model.
// Note. A class call is like a function call.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// Begin to do real-js things, with TS annotations.

const userSchema = new mongoose.Schema<UserDoc>({
  email: {
    type: String,   // !! String is not string.
    required: true
  },
  password: {
    type: String,   // !! String is not string.
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password  // delelte is just a normal js keyword
      delete ret.__v
    }
  }
})

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }

  done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// compiles, and returns a class which implements UserModel.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)


export { User }
