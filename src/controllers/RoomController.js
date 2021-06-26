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
                const roomsExistIds = await db.all(`SELECT id FROM rooms WHERE id = '${roomId}'`);

                isRoom = roomsExistIds.length ? true : false

                if(!isRoom){
                    /* Insere a sala no banco */
                    await db.run(`INSERT INTO rooms (
                        id,
                        pass
                    ) VAlUES (
                        '${roomId}',
                        '${roomPassword}'
                    )`)
                }
            }         

            await db.close();

            res.redirect(`/room/${roomId}`) ;
            
        } catch (error) {
            console.log(error);
            res.json({ success:false, message: 'Ocorreu um erro interno ao criar a sala =(' });
        }
    },

    async open(req, res){
        try {
            const roomId = parseInt(req.params.room);
            const db = await Database();

            /* Verifica se a sala existe */

            const room = await db.all(`SELECT * FROM rooms WHERE id = '${roomId}'`);

            if(!room.length){
                return res.render('index', { page:'no-room', title: 'Sala vazia :(' })
            }

            /* Se a sala existir */

            const questions = await db.all(`SELECT * FROM questions WHERE room = '${roomId}' and read = 0 ORDER BY id DESC`);
            const questionsRead = await db.all(`SELECT * FROM questions WHERE room = '${roomId}' and read = 1 ORDER BY id DESC`);
            let isNoQuestions;
    
            if(!questions.length){
                if(!questionsRead.length){
                    isNoQuestions = true;
                }
            }
    
            res.render("room", {roomId, questions, questionsRead, isNoQuestions});
            
        } catch (error) {
            console.log(error);
            res.json({ success:false, message: 'Ocorreu um erro interno ao carregar a sala :(' });
        }
    },

    async enter(req, res){
        try {
            const { roomId } = req.body;
    
            if(!String(roomId).trim().length){
                return res.json({success:false, message:'Você precisa inserir uma sala.'});   
            }

            const db = await Database();

            const rooms = await db.all(`SELECT id FROM rooms WHERE id = '${parseInt(roomId)}'`)

            if(!rooms.length){
                return res.json({ success:false, message: 'Essa sala não existe' });
            }
            
            res.redirect(`/room/${roomId}`);
            
        } catch (error) {
            console.log(error);
            res.json({ success:false, message: 'Ocorreu um erro interno ao entrar na sala =(' });
        }
    },

    async filterOrder(req, res){
        try {
            
            const { order, filter, roomId } = req.body;
            const orders = {
                'default': 'ORDER BY read ASC, id DESC',
                'newest': 'ORDER BY id DESC',
                'oldest': 'ORDER BY id ASC'
            }
            const filters = {
                'all': '',
                'read': 'AND read = 1',
                'notRead':'AND read = 0'
            }

            if(!order || !filter || !roomId || filters[filter] === undefined || orders[order] === undefined) return res.end();

            const db = await Database();

            const questions = await db.all(`SELECT * FROM questions WHERE room = '${roomId}' ${filters[filter]} ${orders[order]}`);

            res.json({questions});

        } catch (error) {
            console.log(error);
            res.json({ success:false, message: 'Ocorreu um erro interno ao filtrar/ordenar =(' });
        }
    }
}