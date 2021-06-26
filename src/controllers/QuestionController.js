const Database = require('../db/config')

module.exports = {
    async index(req, res){
        const db = await Database();
        const { roomId, questionId, action } = req.params
        const { password } = req.body


        const verifyRoom = await db.get(`SELECT * FROM rooms WHERE id = ${roomId}`);
        if(verifyRoom.pass == password){
            if(action == "delete"){

                await db.run(`DELETE FROM questions WHERE id = ${questionId}`);

            }else if(action == "check"){

                await db.run(`UPDATE questions SET read = 1 WHERE id = ${questionId}`);

            }
            res.redirect(`/room/${roomId}`);
        } else{
            res.render('passincorrect', {roomId: roomId});
        }


    },

    async create(req, res){
        try {
            const db = await Database();
            const { question } = req.body
            const roomId = parseInt(req.params.room);

            const room = await db.all(`SELECT * FROM rooms WHERE id = ${roomId}`);

            if(!room.length){
                return res.json({success: false, message: 'Você está perguntando para uma sala que não existe'});
            }
    
            await db.run(`INSERT INTO questions(
                title,
                room,
                read,
                data
            )VALUES(
                "${question}",
                ${roomId},
                0,
                ${new Date().getTime()}
            )`)
    
            res.json({success: true, message: 'Pergunta registrada! Esperamos que seja respondida logo =)'});
            
        } catch (error) {
            console.log(error);
            res.json({ success:false, message: 'Ocorreu um erro interno ao fazer sua pergunta :(' });
        }
    }
}