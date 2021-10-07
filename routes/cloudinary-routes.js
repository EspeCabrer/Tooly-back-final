const router = require("express").Router()
const {cloudinary} = require("../config/cloudinary.config.js")

router.post( "/upload" , async (req,res)=>{

    try{
        const fileStr = req.body.data
        const uploadedResponse = await  cloudinary.uploader.upload(fileStr, {
            upload_preset: "dev_setups"
        })
        res.send({response: uploadedResponse.public_id})
    }catch(err){
        res.status(500).json({err:"Cloudinary not responding"})
    }
})

module.exports=router