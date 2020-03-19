const con = require('./database');
const bcrypt = require('bcryptjs');

userSignupQuery = async (Request) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(`${Request.password}`, salt);
    const query = 'INSERT INTO user(email, firstname, lastname, username, password, mobile_number, location) VALUES (?, ?, ?, ?, ?, ?, ?);';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.email, Request.firstname, Request.lastname, Request.username, encryptedPass, Request.phone, Request.location], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

userSignup = async (req, res, next) => {
    const Request = req.body;
    try {
        await userSignupQuery(Request);
        res.status(201).send("Customer signup successful! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};


checkUsernameSignupUser = async (req, res, next) => {
    const query = 'SELECT * FROM user WHERE username= ?';
    con.query(query, [req.body.username], (error, results, fields) => {
        if (error) {
            throw error;
        } else {
            if (results.length > 0) {
                res.status(409).send("Username already exists! ");
            } else {
                next();
            }
        }
    });
};

userSignin = async (req, res, next) => {
    const Request = req.body;
    try {
        const results = await userSigninQuery(Request);
        const userDetails = await getUserDetailsQuery(Request);
        const authenticate = await bcrypt.compare(Request.password, results[0].password);
        if (authenticate) {
            Request.username === 'admin' ?
                res.status(200).send("admin")
                : res.status(200).send(userDetails);
        } else {
            res.status(401).send('Incorrect Password! ');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

userSigninQuery = (Request) => {
    const query = 'SELECT password FROM user WHERE username= ?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.username], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

checkUsernameSigninUser = async (req, res, next) => {
    const query = 'SELECT * FROM user WHERE username= ?';
    con.query(query, [req.body.username], (error, results, fields) => {
        if (error) {
            throw error;
        } else {
            if (results.length < 1) {
                res.status(404).send("Username Doesn't exist! ");
            } else {
                next();
            }
        }
    });
};

getUserDetailsQuery = (Request) => {
    const query = 'SELECT username,firstname,lastname,email,mobile_number,location FROM user WHERE username= ?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.username], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

checkAuthUser = (req, res, next) => {
    if (req.session.auth === 'user') {
        next();
    } else {
        res.status(401).send('Only registered users can view contact information, Please login to continue... ');
    }
}





adminSignin = async (req, res, next) => {
    const Request = req.body;
    try {
        const results = await adminSigninQuery(Request);
        const authenticate = await bcrypt.compare(Request.password, results[0].password);
        if (authenticate) {
            req.session.admin_id = results[0].admin_id;
            res.status(200).send('Admin signed in successfully! ')
        } else {
            res.status(401).send('Incorrect password! ');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

adminSigninQuery = (Request) => {
    const query = 'SELECT admin_id,password FROM admin WHERE username= ?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.username], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

checkUsernameSigninAdmin = async (req, res, next) => {
    const query = 'SELECT * FROM admin WHERE username= ?';
    con.query(query, [req.body.username], (error, results, fields) => {
        if (error) {
            throw error;
        } else {
            if (results.length < 1) {
                res.status(404).send("Username Doesn't exist! ");
            } else {
                next();
            }
        }
    });
};

checkAuthAdmin = (req, res, next) => {
    if (req.session.auth === 'admin') {
        next();
    } else {
        res.status(401).send('Only admins can add/update/delete memorials, Please login to continue...');
    }
}

createMemorialQuery = async (Request) => {
    const query = 'INSERT INTO deceased(dob, dod, firstname, lastname, alias, age, born_place, death_place, memorial_views, community, religion, residence, funeral_date, funeral_location, death_reason, status, created_on, display_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    con.query(query, [Request.dob, Request.dod, Request.firstname, Request.lastname, Request.alias, Request.age, Request.pob, Request.pod, 0, Request.community, Request.religion, Request.residence, Request.dof, Request.pof, Request.deathreason, 'pending approval', Date.now(), Request.imageFiles[0]], (error, results, fields) => {
        if (error) {
            throw error;
        } else {
            const query3 = 'INSERT INTO contact(firstname, lastname, relationship, email, location, mobile_number, deceased_id) VALUES (?, ?, ?, ?, ?, ?, ?);';
            con.query(query3, [Request.cfirstname, Request.clastname, Request.relationship, Request.cemail, Request.clocation, Request.cphone, results.insertId], (error, results3, fields) => {
                if (error) {
                    throw error;
                } else {
                    if(Request.videoFiles.length>0){
                    var arr1 = [];
                    for (var i = 0; i < Request.videoFiles.length; i++) {
                        arr1.push([Request.videoFiles[i], results.insertId]);
                    }
                    const query2 = 'INSERT INTO video(video, deceased_id) VALUES ?';
                    con.query(query2, [arr1], (error, results2, fields) => {
                        if (error) {
                            throw error;
                        } else {
                            //video
                        }
                    });
                }
                if(Request.imageFiles.length>0){
                    var arr = [];
                    for (var i = 0; i < Request.imageFiles.length; i++) {
                        arr.push([Request.imageFiles[i], results.insertId]);
                    }
                    const query1 = 'INSERT INTO image(image, deceased_id) VALUES ?';
                    con.query(query1, [arr], (error, results1, fields) => {
                        if (error) {
                            throw error;
                        } else {
                            //image
                        }
                    });
                }





                }
            });

        }
    });

};

createMemorial = async (req, res, next) => {
    const Request = req.body;
    try {
        await createMemorialQuery(Request);
        res.status(201).send("Memorial created successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

approveMemorialQuery = async (Request, Session) => {
    const query = 'UPDATE deceased SET status="approved" WHERE deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

approveMemorial = async (req, res, next) => {
    const Request = req.body;
   
    try {
        await approveMemorialQuery(Request);
        res.status(201).send("Memorial approved successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

deleteMemorialQuery = async (Request) => {
    const query = 'DELETE FROM deceased WHERE deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

deleteMemorial = async (req, res, next) => {
    const Request = req.body;
    try {
        await deleteMemorialQuery(Request);
        res.status(201).send("Memorial deleted successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readMemorialQuery = async () => {
    const query = 'SELECT * FROM deceased where deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readMemorial = async (req, res, next) => {
    Request = req.body;
    try {
        const memorial = await readMemorialQuery(Request);
        res.status(200).send(JSON.stringify(memorial));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readMemorialsApprovedQuery = async () => {
    const query = 'SELECT * FROM deceased WHERE status="approved"';
    return new Promise((resolve, reject) => {
        con.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readMemorialsApproved = async (req, res, next) => {
    try {
        var memorials = await readMemorialsApprovedQuery();
        res.status(200).send(JSON.stringify(memorials));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readMemorialsNotApprovedQuery = async () => {
    const query = 'SELECT * FROM deceased WHERE status="pending approval"';
    return new Promise((resolve, reject) => {
        con.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readMemorialsNotApproved = async (req, res, next) => {
    try {
        var memorials = await readMemorialsNotApprovedQuery();
        res.status(200).send(JSON.stringify(memorials));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

searchMemorialsQuery = async (Request) => {
    const query = 'SELECT * FROM deceased WHERE (firstname=? AND status="approved") OR (lastname=? AND status="approved") OR (born_place=? AND status="approved") OR (death_place=? AND status="approved") OR (residence=? AND status="approved") OR (dob=? AND status="approved") OR (dod=? AND status="approved") OR (funeral_date=? AND status="approved")';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.search,Request.search,Request.search,Request.search,Request.search,Request.search,Request.search,Request.search], (error, results, fields) => {
            if (error) {
                reject(error);
                
            } else {
                
                resolve(results)
            }
        });
    });
};

searchMemorials = async (req, res, next) => {
    const Request = req.body;
    console.log(Request.search)
    try {
        var memorials = await searchMemorialsQuery(Request);
        res.status(200).send(JSON.stringify(memorials));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

createTributeQuery = async (Request) => {
    const query = 'INSERT INTO tribute(firstname, lastname, location, date, message, deceased_id) VALUES (?, ?, ?, ?, ?, ?);';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.firstname, Request.lastname, Request.location, Date.now(), Request.tribute, Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createTribute = async (req, res, next) => {
    const Request = req.body;
    try {
        await createTributeQuery(Request);
        res.status(201).send("Tribute created successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

updateTributeQuery = async (Request, Session) => {
    const query = 'UPDATE tribute SET firstname=?, lastname=?, location=?, date=?, message=?, deceased_id=?, user_id=? WHERE tribute_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.firstname, Request.lastname, Request.location, Request.date, Request.message, Request.deceased_id, Session.user_id, Request.tribute_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

updateTribute = async (req, res, next) => {
    const Request = req.body;
    const Session = req.session;
    try {
        await updateTributeQuery(Request, Session);
        res.status(201).send("Tribute updated successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

deleteTributeQuery = async (Request) => {
    const query = 'DELETE FROM tribute WHERE tribute_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.tribute_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

deleteTribute = async (req, res, next) => {
    const Request = req.body;
    try {
        await deleteTributeQuery(Request);
        res.status(201).send("Tribute deleted successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readTributeQuery = async (Request) => {
    const query = 'SELECT * FROM tribute WHERE deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readTribute = async (req, res, next) => {
    const Request = req.body;
    try {
        const memorialTributes = await readTributeQuery(Request);
        res.status(200).send(JSON.stringify(memorialTributes));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readImagesQuery = async (Request) => {
    const query = 'SELECT * FROM image WHERE deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readImages = async (req, res, next) => {
    const Request = req.body;
    try {
        const img = await readImagesQuery(Request);
        res.status(200).send(JSON.stringify(img));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readVideosQuery = async (Request) => {
    const query = 'SELECT * FROM video WHERE deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readVideos = async (req, res, next) => {
    const Request = req.body;
    try {
        const vid = await readVideosQuery(Request);
        res.status(200).send(JSON.stringify(vid));
    } catch (error) {
        res.status(500).send(error.message);
    }
};

createContactQuery = async (Request) => {
    const query = 'INSERT INTO contact(email=?, mobile_number=?, whatsapp=?, viber=?, location=?, firstname=?, lastname=?, relationship=?, deceased_id=?) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.email, Request.mobile_number, Request.whatsapp, Request.viber, Request.location, Request.firstname, Request.lastname, Request.relationship, Request.deceased_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createContact = async (req, res, next) => {
    const Request = req.body;
    try {
        await createContactQuery(Request);
        res.status(201).send("Contact created successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

updateContactQuery = async (Request) => {
    const query = 'UPDATE contact SET email=?, mobile_number=?, whatsapp=?, viber=?, location=?, firstname=?, lastname=?, relationship=?, deceased_id=? WHERE contact_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.email, Request.mobile_number, Request.whatsapp, Request.viber, Request.location, Request.firstname, Request.lastname, Request.relationship, Request.deceased_id, Request.contact_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

updateContact = async (req, res, next) => {
    const Request = req.body;
    try {
        await updateContactQuery(Request);
        res.status(201).send("Contact updated successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

deleteContactQuery = async (Request) => {
    const query = 'DELETE FROM contact WHERE contact_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.contact_id], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

deleteContact = async (req, res, next) => {
    const Request = req.body;
    try {
        await deleteContactQuery(Request);
        res.status(201).send("Contact deleted successfully! ");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

readContactQuery = async (Request) => {
    const query = 'SELECT * FROM contact WHERE deceased_id=?';
    return new Promise((resolve, reject) => {
        con.query(query, [Request.deceasedId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
        });
    });
};

readContact = async (req, res, next) => {
    const Request = req.body;
    try {
        const memorialContacts = await readContactQuery(Request);
        res.status(200).send(JSON.stringify(memorialContacts));
    } catch (error) {
        res.status(500).send(error.message);
    }
};





module.exports = {
    checkUsernameSignupUser,
    userSignup,
    userSignin,
    checkUsernameSigninUser,
    checkAuthUser,

    adminSignin,
    checkUsernameSigninAdmin,
    checkAuthAdmin,

    createMemorial,



    approveMemorial,
    deleteMemorial,
    
    readMemorialsApproved,
    readMemorialsNotApproved,
    searchMemorials,

    readTribute,
    readMemorial,
    readImages,
    readVideos,
    readContact,

    createTribute,


    updateTribute,
    deleteTribute,
    

    createContact,
    updateContact,
    deleteContact,
    readContact,
}