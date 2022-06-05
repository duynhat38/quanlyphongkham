const AllCodes = require('../models/models.allcodes');

module.exports.index = async function(req, res) {
    try {
        const typeInput = req.body.type;
        const keyInput = req.body.key;
        if (keyInput) {
            var data = await AllCodes.find({ type: typeInput, key: keyInput }, ['-_id', '-__v']);
            return res.status(200).json({ success: true, data: data });
        }
        var data = await AllCodes.find({ type: typeInput }, ['-_id', '-__v']);
        return res.status(200).json({ success: true, data: data });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: true, message: 'Error !!!' })
    }
}