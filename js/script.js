let html;
let searchUsers = (id,e) => {
    let Nstarts = [], NContains = [], SContains = [];
    html = "";
	let searchkey = id.value.trim(" ").toLowerCase();
    if ( searchkey === ""){
		document.getElementById("result").innerText = "";
	}
    else{
        for ( let index = 0; index < userData.length; index++ ) {
            let secondary = 
            userData[index].email.toLowerCase().indexOf(searchkey) > -1 ? userData[index].email :
            userData[index].company.toLowerCase().indexOf(searchkey) > -1 ? userData[index].company :
            userData[index].address.toLowerCase().indexOf(searchkey) > -1 ? userData[index].address : 
            userData[index].phone.toLowerCase().indexOf(searchkey) > -1 ? userData[index].phone : '';

            let IsName = userData[index].displayName.toLowerCase().indexOf(searchkey);
            let user = {
                primary: userData[index].displayName,
                secondary: secondary || userData[index].company
            }
            if(IsName > -1) {
                IsName == 0 ? Nstarts.push(user) : NContains.push(user);
            }
            else if(secondary){
                SContains.push(user);
            }            
        }
        publishUsers(Nstarts.concat(NContains,SContains),searchkey)
    }
}

let publishUsers = (users,searchkey) => {
    let result = document.getElementById("result");
    let len = searchkey.length;
    let matched = '';
    for ( index = 0; index < users.length ; index++){
        html += `<div class='kbu-user-wrap'>
                    <div class='userimg'><img src='http://placehold.it/32x32'></div>
                    <div class='user-desc'> 
                        <span>${users[index].primary}</span>
                        <p>${users[index].secondary}<p>
                    </div>
                </div>`;
    }
    result.innerHTML = html ;
}