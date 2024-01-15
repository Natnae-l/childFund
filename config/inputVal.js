let user = {
    firstName: {
        notEmpty: true,
        errorMessage: 'Enter a valid first name'
    },
    lastName: {
        notEmpty: true,
        errorMessage: 'Enter a valid last name'
    },
    password1:{
        errorMessage: 'The password must be at least 8 characters',
        isLength: { options: { min: 8 } },
  },
    password2:{
        
        isLength: { 
            options: { min: 8 },
            errorMessage: 'The password must be at least 8 characters', 
            bail: true
        },
        custom: { 
            options: matchPassword,
            errorMessage: "Emails don't match!" 
        }
    },
    email: {
        isEmpty: false,
        isEmail: true,
        errorMessage: 'email is not valid'
      },
  };

  function matchPassword(){
    if (password1 == password2) return true;
    return false
  }


  