

document.addEventListener('DOMContentLoaded', function ()  { 




    const form_register = document.querySelector('#user-form');
    const form = document.querySelector('#form');
    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn')

    login()
    
    form.onsubmit =  function (event) { 
        event.preventDefault();
        console.log('Success submiting form!')
        let formdata = { 
                        
                        'username' : form.username.value, 
                        'password' : form.password.value,
                
        }

        fetch('http://127.0.0.1:8000/api/login/', { 

                method : "POST", 
                headers : { 
                    'Content-Type' : 'application/json',
                    
                },

                body: JSON.stringify(formdata)

        })
        .then(response => response.json())
        .then(data => { 
           
            console.log(data)
            
            if (data.token != undefined) {
                console.log(data.token);
                localStorage.clear();
                localStorage.setItem('token',data.token);
                localStorage.setItem('user_id',data.user_id);
                localStorage.setItem('first_name',data.first_name);
                localStorage.setItem('last_name',data.last_name);
                localStorage.setItem('username',data.username);

                window.location = 'http://127.0.0.1:8000';
            }
        
            else { 
                document.querySelector('#errors').innerHTML = 'Not valid credentials';
            }
                    
        })
        .catch(errors => console.log(errors))
        
        return false;
    
}


loginBtn.onclick = login;
registerBtn.onclick = register;

function login () { 
 
    const registerView = document.querySelector('#register-container')
    registerView.style.display = 'none';
    const loginView = document.querySelector('#login-container')
    loginView.style.display = 'block';
    
}

function register() { 
 
    const registerView = document.querySelector('#register-container')
    registerView.style.display = 'block';
    const loginView = document.querySelector('#login-container')
    loginView.style.display = 'none';
    document.querySelector('#errors').innerHTML =''
    
}

form_register.onsubmit = function (event) {

        event.preventDefault(); 
        fetch('http://127.0.0.1:8000/api/registration/', { 
  
            method : "POST",
            headers : { 
                "Content-Type" : "application/json",
                
               
            }, 
            body: JSON.stringify({ 
                'username' : form_register.username.value, 
                'first_name': form_register.first_name.value,
                'last_name' :  form_register.last_name.value, 
                'email' : form_register.email.value, 
                'password' : form_register.password.value, 
                'password2' : form_register.password2.value,
            })
  
        })
        .then(response => response.json())
        .then(data => { 
        
            console.log(data)
            localStorage.clear()
            window.location = 'http://127.0.0.1:8000/';
        })
    
        return false;
}
        

});


    














