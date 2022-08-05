

document.addEventListener('DOMContentLoaded', () => { 

  let token = localStorage.getItem('token');
  const userInfo = document.querySelector('#login-info')

  
//   let userEmailField = document.querySelector('#userEmail');
//   userEmailField.innerHTML = localStorage.getItem('email');
//   userEmail = userEmailField.innerHTML;

  if (token) { 
    userInfo.innerHTML = `Logged in as: ${localStorage.getItem('first_name')} ${localStorage.getItem('last_name')}`

    allposts()
  }
  else { 
    window.location = 'http://127.0.0.1:8000/login/';
  }

  
 
  


  document.querySelector('#logoutBtn').onclick = logout;
  function logout () { 

    fetch('http://127.0.0.1:8000/api/logout/', { 
          
          method: "POST",
          headers: {
              "Content-Type" : "application/json",
              'Authorization': `Token ${localStorage.getItem('token')}`,
          }, 
       
      })
      localStorage.clear();
      window.location = 'http://127.0.0.1:8000'
      console.log("Logout sent successfuly!");
    
    }




    // ............................... this up there is copied from previous project 

    let posts = document.querySelector('#posts');

    // on start load all posts
   



    

    let form = document.querySelector('#user-post-form');

    form.onsubmit = createPost;


    function createPost (e) { 

        e.preventDefault()

        fetch('http://127.0.0.1:8000/api/create/', {
            
            method : "POST",
            headers: { 

                "Content-Type": "application/json",
                "Authorization" : `Token ${localStorage.getItem('token')}`
                
            },

            body: JSON.stringify({ 
                "content": form.content.value,
            
            }),
        
        
        })
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            posts.innerHTML = '';
            form.reset();
            allposts();
            
        })
        
        
        return false;
       
    }





    document.querySelector('#all-posts').onclick = allposts;
    document.querySelector('#followingBtn').onclick = followingposts;
    
    function allposts () { 

        // getting all posts from database 
        

        
        document.querySelector('#user-post-form').style.display = 'block';
        document.querySelector('#profile-page').style.display = 'none';
        document.querySelector('#posts').style.display = 'block';
        document.querySelector('#posts').innerHTML = '';
        document.querySelector('#post-header').innerHTML = 'All posts';
        
        


        fetch('http://127.0.0.1:8000/api/posts/',{ 
            method : "GET",
            headers : { 
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => { 


            // console.log(data);
            let postcard;
            console.log(data);
            for(let post of data) { 
                // console.log(post);
                
                

                // check if post liked or not 
                let check = false;

                for(let user of post.liked){ 
                    if (user.username == localStorage.getItem('username')){ 
                        check = true;
                    }
                }
                
               
                let likedValue = 'Like';
                if (check == true) {

                    likedValue = 'Unlike'
                }
                

                postcard =
                `
                <div class="flex-col post-box margin-top data-postId="${post.id}"> 
                    <p id="user-link" data-user="${post.creator.id}"> @${post.creator.first_name}${post.creator.last_name}</p>
                    <p class="post-bg"> ${post.content} </p>
                    <div class="flex-row">
                        <p id="numLikes" data-like=${post.id}> ${post.num_likes} likes</p>
                        <p data-id="${post.id}" id="likeBtn"> ${likedValue}</p>
                    </div>
                    <h6> ${post.timestamp.substring(0,10)} Posted: ${post.timestamp.substring(11,19)}</h6>
                </div>
                `
                posts.innerHTML += postcard;

                // here, i connect like button with database 

               





                // zagrada od for petlje... ne dirati :)) 
            }


            likeBtns = document.querySelectorAll('#likeBtn')
            likeBtns.forEach(button => {

                button.addEventListener('click', function () { 


                    postId = button.dataset.id

                    fetch(`http://127.0.0.1:8000/api/like/${postId}/`, { 

                        method: "POST", 
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization" : `Token ${localStorage.getItem('token')}`
                        }

                    })
                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);
                        check = false;
                        for(let user of data.liked){ 
                            if (user.username == localStorage.getItem('username')){ 
                                check = true;
                            }
                        }
                      
                       
                        let post_num_likes = document.querySelector(`[data-like="${data.id}"]`)
                        post_num_likes.innerHTML = `${data.num_likes} likes`;
                        
                        if (check==true){
                            likedValue = 'Unlike';
                        }
                        else {
                            likedValue='Like';
                        }

                        this.innerHTML = likedValue;





                        
                    })
                    



                })
                
            });

            // here i add things like link to user profile when clicked on his name... 

            // profile view when clicked on username link ... 
            
            const usernames = document.querySelectorAll("#user-link");
            usernames.forEach(username => { 

                username.onclick = function () { 
                    userId = this.dataset.user;
                    document.querySelector('#profile-page').style.display = 'flex';
                    document.querySelector('#posts').style.display = 'none';
                    document.querySelector('#post-header').innerHTML = 'Profile Page';
                    document.querySelector('#user-post-form').style.display = 'none';

                    profile_info = `<div id="profile-info">`
                    profile_posts = `<div id="profile-posts">`
                    document.querySelector('#profile-page').innerHTML += profile_info
                    document.querySelector('#profile-page').innerHTML += profile_posts

                    fetch(`http://127.0.0.1:8000/api/profile/${userId}/`,{ 
                        method : "GET",
                        headers : { 
                            "Authorization": `Token ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);
                        // here i create user-info part of profile - page 

                        profileInfoUsers(data);
                        // function profileInfoUsers () {

                        
                        // let userCard; 
                        

                        // let check = false;

                        // for(let user of data.followers){ 
                        //     if (user.id == localStorage.getItem('user_id')){ 
                        //         check = true;
                        //     }
                        // }
                        
                    
                        // let follow = "Follow";
                        // if (check == true) {
                        //     follow = "Unfollow";
                        
                        // }
                        // else if (localStorage.getItem('user_id')== data.id) { 
                        //     follow = '';
                        // }




                        

                        // userCard = ` 
                        //     <div class="flex-row user-card-info">
                        //         <p data-user="${data.id}">@${data.first_name} ${data.last_name} </p>
                        //         <div class="flex-col">
                        //             <p>Followers: ${data.num_followers} </p>
                        //             <p>Following: ${data.num_following} </p>
                        //         </div>
                        //         <div class="flex-row">
                        //             <p id="follow" data-userid="${data.id}">${follow}</p>
                                
                        //         </div>
                        //     </div>
                        
                        // `
                        // document.querySelector('#profile-info').innerHTML = ''
                        // document.querySelector('#profile-info').innerHTML += userCard;
                        // document.querySelector('#profile-posts').innerHTML = ''

                        
                        //     // end of a function about profile...
                        // }
                        // here ends fetch about user info..
                    })

                fetch(`http://127.0.0.1:8000/api/user_posts/${userId}/`) 

                        // method: "GET", 
                        // headers: { 
                        //     "Content-Type": "application/json",
                        //     "Authorization" : `Token ${localStorage.getItem('token')}`
                        // }

                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);


                        let postcard;
                        document.querySelector('#profile-posts').innerHTML = ''
            
                        for(let post of data) { 
                            console.log(post);
                            
                            
                            
                            // check if post liked or not 
                            let check = false;
                            
                            
                            for(let user of post.liked){ 
                                if (user.username == localStorage.getItem('username')){ 
                                    check = true;
                                }
                            }
                            
                        
                            let likedValue = 'Like';
                            if (check == true) {

                                likedValue = 'Unlike'
                            }
                            

                            postcard =
                            `
                            <div class="flex-col post-box margin-top data-postId="${post.id}"> 
                                <p data-user="${post.creator.id}"> @${post.creator.first_name}${post.creator.last_name}</p>
                                <p class="post-bg"> ${post.content} </p>
                                <div class="flex-row">
                                    <p id="numLikes" data-like3=${post.id}> ${post.num_likes} likes</p>
                                    <p data-id="${post.id}" id="likeBtn3"> ${likedValue}</p>
                                </div>
                                <h6> ${post.timestamp.substring(0,10)} Posted: ${post.timestamp.substring(11,19)}</h6>
                            </div>
                            `
                            
                            document.querySelector('#profile-posts').innerHTML += postcard;

                            

                    

                            // zagrada od for petlje... ne dirati :)) 
                        }

                        // here i add like buttons for page listed when i click on username of 
                        // user from allposts...

                        likeBtns = document.querySelectorAll('#likeBtn3')
                        likeBtns.forEach(button => {

                            button.addEventListener('click', function () { 


                                postId = button.dataset.id

                                fetch(`http://127.0.0.1:8000/api/like/${postId}/`, { 

                                    method: "POST", 
                                    headers: { 
                                        "Content-Type": "application/json",
                                        "Authorization" : `Token ${localStorage.getItem('token')}`
                                    }

                                })
                                .then(response => response.json())
                                .then(data => { 
                                    console.log(data);
                                    check = false;
                                    for(let user of data.liked){ 
                                        if (user.username == localStorage.getItem('username')){ 
                                            check = true;
                                        }
                                    }
                                
                                
                                    let post_num_likes = document.querySelector(`[data-like3="${data.id}"]`)
                                    post_num_likes.innerHTML = `${data.num_likes} likes`;
                                    
                                    if (check==true){
                                        likedValue = 'Unlike';
                                    }
                                    else {
                                        likedValue='Like';
                                    }

                                    this.innerHTML = likedValue;





                                    
                                })
                                



                            })
                            
                        });

                        const followBtn = document.querySelector('#follow');
                        console.log(followBtn);
                    
                        followBtn.onclick = function () { 

                            userId = followBtn.dataset.userid


                            fetch(`http://127.0.0.1:8000/api/follow/${userId}/`, { 

                                    method: "POST", 
                                    headers: { 
                                        "Content-Type": "application/json",
                                        "Authorization" : `Token ${localStorage.getItem('token')}`
                                    }

                            })
                            .then(response => response.json())
                            .then(data => { 
                                console.log(data);


                                profileInfoUsers(data);
                            })

                        






                    
                        }

                    

                                    // zagrada od then iznad 
                    })

                

                    // ove zagrade ne diratiii...

                }
            

            })

        



        







        })

        
        

    }

    
    
    function followingposts () { 

        // getting all posts from database 
        
        document.querySelector('#user-post-form').style.display = 'none';
        document.querySelector('#profile-page').style.display = 'none';
        document.querySelector('#posts').style.display = 'block';
        document.querySelector('#posts').innerHTML = '';
        document.querySelector('#post-header').innerHTML = 'Following posts';
        


        fetch(`http://127.0.0.1:8000/api/following_post/${localStorage.getItem('username')}`,{ 
            method : "GET",
            headers : { 
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => { 


            // console.log(data);
            let postcard;
            console.log(data);
            for(let post of data) { 
                // console.log(post);
                
                

                // check if post liked or not 
                let check = false;

                for(let user of post.liked){ 
                    if (user.username == localStorage.getItem('username')){ 
                        check = true;
                    }
                }
                
               
                let likedValue = 'Like';
                if (check == true) {

                    likedValue = 'Unlike'
                }
                

                postcard =
                `
                <div class="flex-col post-box margin-top data-postId="${post.id}"> 
                    <p id="user-link" data-user="${post.creator.id}"> @${post.creator.first_name}${post.creator.last_name}</p>
                    <p class="post-bg"> ${post.content} </p>
                    <div class="flex-row">
                        <p id="numLikes" data-like=${post.id}> ${post.num_likes} likes</p>
                        <p data-id="${post.id}" id="likeBtn"> ${likedValue}</p>
                    </div>
                    <h6> ${post.timestamp.substring(0,10)} Posted: ${post.timestamp.substring(11,19)}</h6>
                </div>
                `
                posts.innerHTML += postcard;

                // here, i connect like button with database 

               





                // zagrada od for petlje... ne dirati :)) 
            }


            likeBtns = document.querySelectorAll('#likeBtn')
            likeBtns.forEach(button => {

                button.addEventListener('click', function () { 


                    postId = button.dataset.id

                    fetch(`http://127.0.0.1:8000/api/like/${postId}/`, { 

                        method: "POST", 
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization" : `Token ${localStorage.getItem('token')}`
                        }

                    })
                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);
                        check = false;
                        for(let user of data.liked){ 
                            if (user.username == localStorage.getItem('username')){ 
                                check = true;
                            }
                        }
                      
                       
                        let post_num_likes = document.querySelector(`[data-like="${data.id}"]`)
                        post_num_likes.innerHTML = `${data.num_likes} likes`;
                        
                        if (check==true){
                            likedValue = 'Unlike';
                        }
                        else {
                            likedValue='Like';
                        }

                        this.innerHTML = likedValue;





                        
                    })
                    



                })
                
            });

            // here i add things like link to user profile when clicked on his name... 

            // profile view when clicked on username link ... 
            
            const usernames = document.querySelectorAll("#user-link");
            usernames.forEach(username => { 

                username.onclick = function () { 
                    userId = this.dataset.user;
                    document.querySelector('#profile-page').style.display = 'flex';
                    document.querySelector('#posts').style.display = 'none';
                    document.querySelector('#post-header').innerHTML = 'Profile Page';
                    document.querySelector('#user-post-form').style.display = 'none';

                    profile_info = `<div id="profile-info">`
                    profile_posts = `<div id="profile-posts">`
                    document.querySelector('#profile-page').innerHTML += profile_info
                    document.querySelector('#profile-page').innerHTML += profile_posts

                    fetch(`http://127.0.0.1:8000/api/profile/${userId}/`,{ 
                        method : "GET",
                        headers : { 
                            "Authorization": `Token ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);
                        // here i create user-info part of profile - page 

                        profileInfoUsers(data);
                        // function profileInfoUsers () {

                        
                        // let userCard; 
                        

                        // let check = false;

                        // for(let user of data.followers){ 
                        //     if (user.id == localStorage.getItem('user_id')){ 
                        //         check = true;
                        //     }
                        // }
                        
                    
                        // let follow = "Follow";
                        // if (check == true) {
                        //     follow = "Unfollow";
                        
                        // }
                        // else if (localStorage.getItem('user_id')== data.id) { 
                        //     follow = '';
                        // }




                        

                        // userCard = ` 
                        //     <div class="flex-row user-card-info">
                        //         <p data-user="${data.id}">@${data.first_name} ${data.last_name} </p>
                        //         <div class="flex-col">
                        //             <p>Followers: ${data.num_followers} </p>
                        //             <p>Following: ${data.num_following} </p>
                        //         </div>
                        //         <div class="flex-row">
                        //             <p id="follow" data-userid="${data.id}">${follow}</p>
                                
                        //         </div>
                        //     </div>
                        
                        // `
                        // document.querySelector('#profile-info').innerHTML = ''
                        // document.querySelector('#profile-info').innerHTML += userCard;
                        // document.querySelector('#profile-posts').innerHTML = ''

                        
                        //     // end of a function about profile...
                        // }
                        // here ends fetch about user info..
                    })

                fetch(`http://127.0.0.1:8000/api/user_posts/${userId}/`) 

                        // method: "GET", 
                        // headers: { 
                        //     "Content-Type": "application/json",
                        //     "Authorization" : `Token ${localStorage.getItem('token')}`
                        // }

                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);


                        let postcard;
                        document.querySelector('#profile-posts').innerHTML = ''
            
                        for(let post of data) { 
                            console.log(post);
                            
                            
                            
                            // check if post liked or not 
                            let check = false;
                            
                            
                            for(let user of post.liked){ 
                                if (user.username == localStorage.getItem('username')){ 
                                    check = true;
                                }
                            }
                            
                        
                            let likedValue = 'Like';
                            if (check == true) {

                                likedValue = 'Unlike'
                            }
                            

                            postcard =
                            `
                            <div class="flex-col post-box margin-top data-postId="${post.id}"> 
                                <p data-user="${post.creator.id}"> @${post.creator.first_name}${post.creator.last_name}</p>
                                <p class="post-bg"> ${post.content} </p>
                                <div class="flex-row">
                                    <p id="numLikes" data-like3=${post.id}> ${post.num_likes} likes</p>
                                    <p data-id="${post.id}" id="likeBtn3"> ${likedValue}</p>
                                </div>
                                <h6> ${post.timestamp.substring(0,10)} Posted: ${post.timestamp.substring(11,19)}</h6>
                            </div>
                            `
                            
                            document.querySelector('#profile-posts').innerHTML += postcard;

                            

                    

                            // zagrada od for petlje... ne dirati :)) 
                        }

                        // here i add like buttons for page listed when i click on username of 
                        // user from allposts...

                        likeBtns = document.querySelectorAll('#likeBtn3')
                        likeBtns.forEach(button => {

                            button.addEventListener('click', function () { 


                                postId = button.dataset.id

                                fetch(`http://127.0.0.1:8000/api/like/${postId}/`, { 

                                    method: "POST", 
                                    headers: { 
                                        "Content-Type": "application/json",
                                        "Authorization" : `Token ${localStorage.getItem('token')}`
                                    }

                                })
                                .then(response => response.json())
                                .then(data => { 
                                    console.log(data);
                                    check = false;
                                    for(let user of data.liked){ 
                                        if (user.username == localStorage.getItem('username')){ 
                                            check = true;
                                        }
                                    }
                                
                                
                                    let post_num_likes = document.querySelector(`[data-like3="${data.id}"]`)
                                    post_num_likes.innerHTML = `${data.num_likes} likes`;
                                    
                                    if (check==true){
                                        likedValue = 'Unlike';
                                    }
                                    else {
                                        likedValue='Like';
                                    }

                                    this.innerHTML = likedValue;





                                    
                                })
                                



                            })
                            
                        });

                        const followBtn = document.querySelector('#follow');
                        console.log(followBtn);
                    
                        followBtn.onclick = function () { 

                            userId = followBtn.dataset.userid


                            fetch(`http://127.0.0.1:8000/api/follow/${userId}/`, { 

                                    method: "POST", 
                                    headers: { 
                                        "Content-Type": "application/json",
                                        "Authorization" : `Token ${localStorage.getItem('token')}`
                                    }

                            })
                            .then(response => response.json())
                            .then(data => { 
                                console.log(data);


                                profileInfoUsers(data);
                            })

                        






                    
                        }

                    

                                    // zagrada od then iznad 
                    })

                

                    // ove zagrade ne diratiii...

                }
            

            })

        



        







        })

        
        

    }
    



    const profilePageBtn = document.querySelector('#profile-pageBtn');
    profilePageBtn.onclick = profilePage;

    function profilePage()  {

        document.querySelector('#user-post-form').style.display = 'none';
        document.querySelector('#profile-page').style.display = 'flex';
        document.querySelector('#posts').style.display = 'none';
        document.querySelector('#post-header').innerHTML = 'Profile Page'

        profile_info = `<div id="profile-info">`
        profile_posts = `<div id="profile-posts">`
        document.querySelector('#profile-page').innerHTML += profile_info
        document.querySelector('#profile-page').innerHTML += profile_posts

        fetch(`http://127.0.0.1:8000/api/profile/${localStorage.getItem('username')}`,{ 
            method : "GET",
            headers : { 
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            // here i create user-info part of profile - page 

            let userCard; 

            userCard = ` 
                <div class="flex-col user-card-info">
                    <p>@${data.first_name} ${data.last_name} </p>
                    <div class="flex-row">
                        <p>Followers: ${data.num_followers} </p>
                        <p>Following: ${data.num_following} </p>
                    </div>

                   
                </div>
            
            `
            


            document.querySelector('#profile-info').innerHTML = ''
            document.querySelector('#profile-info').innerHTML += userCard;
            document.querySelector('#profile-posts').innerHTML = ''
            

            // here ends fetch about user info..
        })

        // here is a fetch about user posts from database for profile-page .. 

        fetch(`http://127.0.0.1:8000/api/logged_user_posts/`)
        .then(response => response.json())
        .then(data => { 

            // console.log(data);

            let postcard;
            console.log(data);
            for(let post of data) { 
                console.log(post);
                
                
                
                // check if post liked or not 
                let check = false;
                
                for(let user of post.liked){ 
                    if (user.username == localStorage.getItem('username')){ 
                        check = true;
                    }
                }
                
               
                let likedValue = 'Like';
                if (check == true) {

                    likedValue = 'Unlike'
                }
                

                postcard =
                `
                <div class="flex-col post-box margin-top data-postId="${post.id}"> 
                    <p> @${post.creator.first_name}${post.creator.last_name}</p>
                    <p class="post-bg"> ${post.content} </p>
                    <div class="flex-row">
                        <p id="numLikes" data-like2=${post.id}> ${post.num_likes} likes</p>
                        <p data-id="${post.id}" id="likeBtn2"> ${likedValue}</p>
                    </div>
                    <h6> ${post.timestamp.substring(0,10)} Posted: ${post.timestamp.substring(11,19)}</h6>
                </div>
                `
                
                document.querySelector('#profile-posts').innerHTML += postcard;

                // here, i connect like button with database 

               





                // zagrada od for petlje... ne dirati :)) 
            }


            likeBtns = document.querySelectorAll('#likeBtn2')
            likeBtns.forEach(button => {

                button.addEventListener('click', function () { 


                    postId = button.dataset.id

                    fetch(`http://127.0.0.1:8000/api/like/${postId}/`, { 

                        method: "POST", 
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization" : `Token ${localStorage.getItem('token')}`
                        }

                    })
                    .then(response => response.json())
                    .then(data => { 
                        console.log(data);
                        check = false;
                        for(let user of data.liked){ 
                            if (user.username == localStorage.getItem('username')){ 
                                check = true;
                            }
                        }
                      
                       
                        let post_num_likes = document.querySelector(`[data-like2="${data.id}"]`)
                        post_num_likes.innerHTML = `${data.num_likes} likes`;
                        
                        if (check==true){
                            likedValue = 'Unlike';
                        }
                        else {
                            likedValue='Like';
                        }

                        this.innerHTML = likedValue;





                        
                    })
                    



                })
                
            });





        })





    }






    function profileInfoUsers (data) {

        console.log('User id: ' + data.id);
        let userCard; 
        

        let check = false;

        for(let user of data.followers) { 
            if (user == localStorage.getItem('user_id')){ 
                check = true;
                
            }
        }
        
        console.log(data.followers);
        console.log(check);
        let follow = "Follow";
        if (check == true) {
            follow = "Unfollow";
        
        }
        else if (localStorage.getItem('user_id') == data.id) { 
            follow = '';
        }


        userCard = ` 
            <div class="flex-row user-card-info">
                <p data-user="${data.id}">@${data.first_name} ${data.last_name} </p>
                <div class="flex-col">
                    <p>Followers: ${data.num_followers} </p>
                    <p>Following: ${data.num_following} </p>
                </div>
                <div id="not-active" class="flex-row">
                    <p id="follow" data-userid="${data.id}">${follow}</p>
                </div>
            </div>
        
            `
        
        
        
        
       
        document.querySelector('#profile-info').innerHTML = '';
        document.querySelector('#profile-info').innerHTML += userCard;

        if (follow === '') { 
            document.querySelector('#not-active').style.display = 'none';
            document.querySelector('#follow').style.display = 'none';
        }
        

        const followBtn = document.querySelector('#follow');
                        console.log(followBtn);
                    
                        followBtn.onclick = function () { 

                            userId = followBtn.dataset.userid

                            fetch(`http://127.0.0.1:8000/api/follow/${userId}/`, { 

                                    method: "POST", 
                                    headers: { 
                                        "Content-Type": "application/json",
                                        "Authorization" : `Token ${localStorage.getItem('token')}`
                                    }

                            })
                            .then(response => response.json())
                            .then(data => { 
                                console.log(data);

                                profileInfoUsers(data);
                            })





                        }
            // end of a function about profile...
            }

   

// zagrada od DOMContentLOADED

})