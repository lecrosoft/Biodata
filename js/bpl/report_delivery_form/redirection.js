function redirection(){
    var x = location.hash.replace('#','')
    //console.log(x)
    // addfullweight(location.hash.replace('#',''))
    var split = x.split('_');
    if(split[0] == "updateweight"){
        addfullweight(split[1])
    }
    else if(split[0]== "edit"){
        editreport(split[1]);
    }

}