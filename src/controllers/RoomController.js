const Database = require("../db/config")

module.exports = {
    async create(req, res){ //criar sala
        try {

            const { roomPassword } = req.body;
                    /* validações da senha  */

            if(!roomPassword.trim().length){
               return res.json({success:false, message:'Você precisa inserir uma senha.'});              
            }
        
            if(roomPassword.trim().length >= 50){
                return res.json({success:false, message:'Sua senha precisa ser menor que 50 caracteres'});  
            }

            const db = await Database();
            let roomId = ''
            let isRoom = true

            while(isRoom){
                
                for(var i = 0; i < 6; i++){
                    let randomNumber = Math.floor(Math.random() * 10)
                    while(randomNumber === 0){
                        randomNumber = Math.floor(Math.random() * 10)
                    }
                    roomId += String(randomNumber)
                }

                roomId = parseInt(roomId);

                /* Verificar se esse numero já existe */
                const roomsExistIds = await db.all(`SELECT id FROM rooms WHERE id = ${roomId}`);

                isRoom = roomsExistIds.length ? true : false

                if(!isRoom){
                    /* Insere a sala no banco */
                    await db.run(`INSERT INTO rooms (
                        id,
                        pass
                    ) VAlUES (
                        ${roomId},
                        "${roomPassword}"
                    )`)
                }
            }         

            await db.close();

            res.redirect(`/room/${roomId}`) ;
            
        } catch (error) {
            console.log(error);
            res.json({ sucess:false, message: 'Ocorreu um erro interno ao criar a sala =(' });
        }
    },

    async open(req, res){
        const db = await Database();
        const roomId = req.params.room;
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0`);
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1`);
        let isNoQuestions;

        if(questions.length ==0){
            if(questionsRead.length == 0){
                isNoQuestions = true;
            }
        }

        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions});
    },

    async enter(req, res){
        try {
            const { roomId } = req.body;
    
            if(!String(roomId).trim().length){
                return res.json({success:false, message:'Você precisa inserir uma sala.'});   
            }

            const db = await Database();

            const rooms = await db.all(`SELECT id FROM rooms WHERE id = ${parseInt(roomId)}`)

            if(!rooms.length){
                return res.json({ sucess:false, message: 'Essa sala não existe' });
            }
            
            res.redirect(`/room/${roomId}`);
            
        } catch (error) {
            console.log(error);
            res.json({ sucess:false, message: 'Ocorreu um erro interno ao entrar na sala =(' });
        }
    }
}