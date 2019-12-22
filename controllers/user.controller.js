const User = require('../models/user.model');

exports.user = function (req, res) {
       let user = new User({
              firstname: "Piyumi",
              lastname: "Sudusinghe",
              username:"Piyumi",
              email:"piyumisu@gmail.com",
              userType:'Local_Assistent',
              telephone_number:['0715818904'],
              nic_num:"955902341V",
              guide_location:{type: "MultiPoint",
                                   coordinates: [[-113.806458, 44.847784],[12.123456, 13.134578]]
                            },
              password:"pass123"
       });

       user.save((err, user) => {
              if (err) {
                  console.log("error");
                  console.log(err);
                  res.send("error");

              } else {
                  console.log("added.");
                  res.send("added.");
              }
          });


      // res.send('Greetings from the User controller!');
};
