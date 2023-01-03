
(function (){
    // we can set some variables for html elements that we need here
    // elements in search box
    let usernameInput = document.getElementById("username")
    let submitButton = document.getElementById("submit")
    //elements in information header
    let userImg = document.getElementById("avatar")
    let completeName = document.getElementById("complete-name")
    let blog = document.getElementById("blog-addr")
    let userLocation = document.getElementById("location")
    //elements in information footer
    let bio = document.getElementById("bio")
    let progLang = document.getElementById("prog-lang")

    // github api for getting user info
    const baseURL = "https://api.github.com/users/"


    submitButton.onclick = function(){
        let username = usernameInput.value;
        // get data of user from localStorage if exist. 
        // if that user is new the userData value is set to null
        let userData = window.localStorage.getItem(username)

        if(userData == null){
            userData = fetchData(baseURL+username)
        }else{

        }
    }

    /* 
        with fetch we can send a http request. during this process may occur some problems.
        we have set some error message for some 400 family codes. if we have some problems
        in network connection we should set appropriate message.
    */
    async function fetchData(url) {
        try {
            let response = await fetch(url)
            if (!response.ok) {

                if (response.status == 404)
                    showError("User not found.")
        
                if (response.status == 403)
                    showError("Forbidden (Maybe because of rate limit.)")
        
                showError(`Error in getting user info with error ${response.status}`)
            }else{
                return response.json()
            }
        } catch(e) {
            console.log(e)
            showError("network error")
        }   
    }

    // save user information in localstorage
    function saveInfo(username, userData){
        console.log("saving:"+userData)
        window.localStorage.setItem(username, userData)
    }
    /*

    */
    function showError(text) {
        errorWrapper.style.width = '100%'
        errorWrapper.textContent = text
        console.log('timeout staretd')
        setTimeout(() => {
            console.log('timeout finished')
            errorWrapper.style.width = '0'
            errorWrapper.textContent = ''
        }, 4000)
    }

    /*
        userData (maybe from local storage or from http get) can be updated 
        from js. we update user info fields in html by this function.
    */
    function updateInfo(userData){

        if(userData["avatar_url"] == "" || userData["avatar_url"] == null){
            userImg.src = "img/notfound.png"
        }else{
            userImg.src = userData["avatar_url"]
        }

        if(userData["blog"] == "" || userData["blog"] == null){
            blog.innerText = "blog: Has not been set"
        }else{
            blog.innerText = userData["blog"]
        }

        if(userData["name"] == "" || userData["name"] == null){
            completeName.innerText = "name: Has not been set"
        }else{
            completeName.innerText = userData["name"]
        }

        if(userData["location"] == "" || userData["location"] == null){
            userLocation.innerText = "location: Has not been set"
        }else{
            userLocation.innerText = userData["location"]
        }

        if(userData["bio"] == "" || userData["bio"] == null){
            bio.innerText = "bio: Has not been set"
        }else{
            bio.innerText = userData["bio"]
        }
        
        if(userData["max_lang"] == undefined){
            reposUrl = userData["repos_url"]
            return sortRepos(reposUrl)
        }
        else
            setTopLanguage(userData["max_lang"])
    }
}
)