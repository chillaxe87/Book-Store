email: {
    type: String,
    required: true,
    trim: true,
    unique:true,
    lowercase: true,
    validate(value) {
        if(!validator.isEmail(value)){
            throw new Error('Email is Invalid')
        }
    }
},
password: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
        if(value.length < 6){
            throw new Error("Password is too short")
        } else if (value.toLowerCase().includes("password")){
            throw new Error("Password cannot contain: 'password'")
        }
    }
},