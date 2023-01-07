/*
    This is a project for Internet Engineering Course - Fall 2022
    Mid-term Exam.
    @author : Mahdi Rahmani
*/

/*
    An IIFE is a good way to secure the scope. You can use IIFEs to prevent 
    global variables' definition issues,alias variables, protect private data,
    and avoid conflicts of using many libraries that export the same object name.
*/
(function iife(){

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
    // element related to showing error
    let error = document.getElementById('error')
    // element related to showing catch message
    let catch_element = document.getElementById('catch')

    // github api for getting user info
    const baseURL = "https://api.github.com/users/"

    // if the submit button clicked this fuction is going to be run.
    // it concates the username with base url.
    // first we see if the user in the local storage so doesnt need th fetch again.
    // if the user isnt in local storage we should call fetch function. 
    submitButton.onclick = function(){
        let username = usernameInput.value;
        // get data of user from localStorage if exist. 
        // if that user is new the userData value is set to null
        let userData = window.localStorage.getItem(username)

        console.log(baseURL+username)
        if(userData == null){
            userData = myFetch(baseURL+username)
            userData.then((data)=>{
                if(data != undefined){
                    console.log("hereee")
                    intrested_lang = updateUserInfo(data)
                    console.log(intrested_lang)
                    intrested_lang.then(()=>{
                        data["intrested_lang"] = progLang.innerText
                        saveInfo(username, JSON.stringify(data))
                    })
                }
                return
            })
        }else{
            console.log("read data from cache for user: "+ username)
            updateUserInfo(JSON.parse(userData))
            catch_message("(read data from cache for user: "+ username+" by Local storage)")
        }
    }

    /*
        This function is used for showing catch data. show the message for 7 seconds.
    */
    function catch_message(text){
        catch_element.style.display = 'flex'
        catch_element.textContent = text
        setTimeout(() => {

            catch_element.style.display = 'none'
            catch_element.textContent = ''
    
        }, 7000)
    }
    /* 
        with fetch we can send a http request. during this process may occur some problems.
        we have set some error message for some 400 family codes. if we have some problems
        in network connection we should set appropriate message.
    */
    async function myFetch(url) {
        try {
            let response = await fetch(url)
        
            if(!response.ok) {
                showError(response.status)
                return Promise.reject(`Request failed with error ${response.status}`)
            }
            return response.json()
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
        reposData = myFetch(reposURL)
        
        return reposData.then((val)=>{
            val.sort((a, b)=>{
                return a.pushed_at < b.pushed_at
            })
            let repos = val
            let langScore = new Array()
            let numberOfCheckRepository = Math.min(repos.length, 5);
            let intrestedLang = ""
            let highestScore = 0
            for(let i = 0; i < numberOfCheckRepository; i++){
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

            progLang.innerText = intrestedLang
        })
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
            blog.href = userData["blog"]
            
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
        

        if(userData["intrested_lang"] == undefined){
            reposUrl = userData["repos_url"]
            return findIntrestedLanguage(reposUrl)
        }
        else{
            progLang.innerText = userData["intrested_lang"]
        }
    }

    /*
        show the text as error message in the error div.
        set timeout for hiding error message after 5 seconds from screen.
    */
    function showError(status) {
        let error_msg = `Error in getting user info with error: ${status}`
        
        if (status == 404)
            error_msg = "User not found."
        if (status == 403)
            error_msg = "Forbidden (Maybe because of rate limit.)"
        
        error.style.display = 'flex'
        error.textContent = error_msg

        setTimeout(() => {

            error.style.display = 'none'
            error.textContent = ''

        }, 5000)

        console.log(error)
    }
}
)()