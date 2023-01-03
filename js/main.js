
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