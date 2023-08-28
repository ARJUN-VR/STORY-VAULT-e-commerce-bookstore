const paypal = require('paypal-rest-sdk');



paypal.configure({
  mode: 'sandbox', // Use 'sandbox' for testing; 'live' for production
  client_id: "AUzK-Dc7oQBq9rhUOcMEaeqWo4wohCprFSAKfm6heS-ktAJj8Hi5uqlz9jVG-pi31VkppaQlrzPKG_P7",
  client_secret:"EMvEwjbuwxghIm58_sc2JdSPp9D-7hjFv4yp1dc9fCwR1uDrTBpf9PMxT1OEou5j7rjqgx90cR8-_Lns",
});



module.exports = paypal
