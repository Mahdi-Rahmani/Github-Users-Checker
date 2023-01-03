
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
            userData = myFetch(baseURL+username)
            userData.then((data)=>{
                if(data != undefined){
                    data["intrested_lang"] = findIntrestedLanguage(userData["repos_url"])
                    updateUserInfo(data) 
                    saveInfo(username, JSON.stringify(data))
                }
                return
            })
        }else{
            console.log("read data from cache for user: "+ username)
            updateUserInfo(JSON.parse(userData))
        }
    }

    /* 
        with fetch we can send a http request. during this process may occur some problems.
        we have set some error message for some 400 family codes. if we have some problems
        in network connection we should set appropriate message.
    */
    async function myFetch(url) {
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

    /*
        function below find the more intrested language of user
        for this job we find the 5 last pushed and then find the mostly
        used language in them
    */
    function findIntrestedLanguage(reposURL){
        // first we should fetch data related to repos with myFetch
        reposData = myFetch(reposURL)
        
        // then we should sort repos according to their push time (pushed_at field)
        let repos = null
        reposData.then((val)=>{
            val.sort((a, b)=>{
                return a.pushed_at < b.pushed_at
            })
            repos = val
        })
        // now we should find high-scored language among 5 or less last pushed repos
        // if repos count was less than 5
        let numberOfCheckRepository = Math.min(repos.length, 5);
        console.log("number is",numberOfCheckRepository) 
        let langScore = new Array()
        let intrestedLang = "" 
        let highestScore = 0
        for(let i = 0; i < numberOfCheckRepository ; i++){
            if(repos[i]["language"] !== null){
                if(repos[i]["language"] in langScore){
                    langScore[repos[i]["language"]]++
                }else
                    langScore[repos[i]["language"]] = 1
                if(langScore[repos[i]["language"]] > highestScore){
                    highestScore = langScore[repos[i]["language"]]
                    intrestedLang = repos[i]["language"]
                }
            }
        }  
        return intrestedLang
    }

    // save user information in localstorage
    function saveInfo(username, userData){
        console.log("saving:"+userData)
        window.localStorage.setItem(username, userData)
    }

    /*
        userData (maybe from local storage or from http get) can be updated 
        from js. we update user info fields in html by this function.
    */
    function updateUserInfo(userData){

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
        
        if(userData["intrested_lang"] == "" || userData["intrested_lang"] == null){
            progLang.innerText = "Intrested language not set"
        }
        else{
            progLang.innerText = userData["intrested_lang"]
        }
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
}
)