import { Router } from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })

const router = Router();

router.post('api/images', upload.array('images', 12) , (req, res, next) => {
    console.log("Upload Successful");
    res.json(req.file);
})

router.post('api/videos', upload.array('videos', 12), (req, res, next) => {
    console.log("Upload Successful");
})

export default router;