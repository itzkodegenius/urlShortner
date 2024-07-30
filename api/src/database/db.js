import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'
const connectDB = async () =>{
try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`Connected to ${DB_NAME} database`)
} catch (error) {
    console.log(`Error`, error.message)
}   
}

export {
    connectDB
}