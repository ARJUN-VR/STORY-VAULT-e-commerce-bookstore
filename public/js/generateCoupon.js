function generateCoupon(){
    const input = document.getElementById('generatecoupon')
    const couponCode=generateRandomCoupon()

    input.value=couponCode
    console.log(couponCode);
}

function generateRandomCoupon(){
    let coupon='';
    const characters='abBF12345EUIWO'
    for(i=0;i<7;i++){
        const index=Math.floor(Math.random()*characters.length)
        coupon+=characters.charAt(index)
    }
    return coupon
}