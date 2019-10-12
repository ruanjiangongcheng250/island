function f1(){
       f2() 
}
async function f2(){
    try {
        f3()
    } catch (error) {
        console.log('error')
    }
    
}
f1()
function f3(){
    return new Promise((resolve, reject)=>{
        setTimeout(function(){
            const r = Math.random();
            if(r < 0.9){
                reject('error')
            }
        }, 1000)
    })
}
