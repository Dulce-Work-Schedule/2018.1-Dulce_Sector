var Promise = require('bluebird');

module.exports = function(options){

  this.add('role:sector,cmd:create', async function create (msg,respond) {
    var sector = this.make('sectors')
    sector.name = msg.name
    sector.hospital_id = msg.hospital_id

    var result = {success:false};

    var sector_list$ = Promise.promisify(sector.list$, { context: sector });

    await sector_list$(
      {
        name: sector.name,
        hospital_id: sector.hospital_id
      })
      .then(await function(list_of_sectors){
        if (list_of_sectors.length != 0){
          result.duplicate_sector_error = 'Este setor já existe neste hospital'
          respond(null, result)
        }
      })
      .catch(function(err) {
        console.log('error')
        console.log(err)
      })

    sector.save$(function(err,sector){
      respond(null,sector)
    })
  })

  this.add('role:sector, cmd:list', function list(msg, respond){
    var sector = this.make('sectors');
    sector.list$({all$:true}, function(error,sector){
      respond(null,sector);
    });
  })

  this.add('role:sector, cmd:view', function list(msg, respond){
    result  = {};
    var sector = this.make('sectors');
    sector_id = msg.sector_id
    sector.load$({id:sector_id}, function(error,sector){
      if (sector  == null){
        result.sector_not_find_error = "Setor não encontrado"
        result.sucess = false
        respond(null,result);
      } else {
        respond(null,sector);
      }
    });
  })

  this.add('role:sector, cmd:listByHospital', function list(msg, respond){
    result  = {};
    var sector = this.make('sectors');
    hospital_id = msg.hospital_id
    sector.list$({hospital_id:hospital_id}, function(error,sector){
      if (sector.length == 0){
        result.hospital_not_find_error = "Hospital não possui nenhum setor cadastrado"
        result.sucess = false
        respond(null,result);
      } else {
        respond(null,sector);
      }
    });
  })

  this.add('role:sector, cmd:error', function error(msg, respond){
    respond(null, {success:false, message: 'acesso negado'});
  })

}
