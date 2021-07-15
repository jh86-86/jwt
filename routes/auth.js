const router =require("express").Router();

router.post('/signup', (req,res)=>{    // hange route to /test then that need to be added to url
    res.send("Auth route is working");
});



module.exports = router;