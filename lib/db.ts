import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI!;
 
declare global {
  // allow global var in dev to prevent multiple connections during HMR
  
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global._mongoose;
if(!cached) cached = global._mongoose = {conn:null,promise:null};

export async function dbconnect() {
    if(cached!.conn) return cached?.conn;

    if(!cached!.promise){
        if(!MONGO_URI){
            cached!.promise = Promise.resolve(mongoose);
        }else{
            const opts = {
                bufferCommands : false,
                maxPoolSize : 10
            }
            cached!.promise = mongoose.connect(MONGO_URI,opts).then((m)=>m);    
        }
    }
    cached!.conn = await cached!.promise;
    return cached!.conn;
    
}