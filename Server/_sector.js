module.exports = function(options){

  this.add('role:sector,cmd:create', function create (msg,respond) {
    var sector = this.make('sectors')
    sector.name = msg.name
    sector.save$(function(err,sector){
      respond(null,sector)
    })
  })

  this.add('role:sector, cmd:listSector', function listSector(msg, respond){
    var sector = this.make('sectors');
    sector.list$({all$:true}, function(error,sector){
      respond(null,sector);
    });
  })

  this.add('role:sector, cmd:error', function error(msg, respond){
    respond(null, {success:false, message: 'acesso negado'});
  })

}
