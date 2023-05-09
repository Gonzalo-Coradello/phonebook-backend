const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url, { dbName: 'phonebook' })
  .then(result => {
    console.log('Connected to DB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length >= 3
      },
      message: props => 'Name should be at least three characters long',
    },
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{6,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`,
    },
    required: [true, 'Phone number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
