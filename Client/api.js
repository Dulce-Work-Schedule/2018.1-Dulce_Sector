// The RegExp Object above validates MongoBD ObjectIds
var checkObjectId = new RegExp('^[0-9a-fA-F]{24}$');

function validate_field(field, result){
  if (field.value == null || field.value == ''){
    result[field.field_name + '_error'] = 'O campo ' + field.verbose + ' é obrigatório.';
  } else if (typeof(field.value) != 'string') {
    result[field.field_name + '_error'] = 'O campo ' + field.verbose +' deve ser uma string.';
  }
  return result;
}

function validate_id(field, result){
  if (field.value == null || field.value == ''){
    result[field.field_name + '_error'] = 'O campo ' + field.verbose + ' é obrigatório.';
  } else if (!checkObjectId.test(field.value)) {
    result[field.field_name + '_error'] = 'O ' + field.verbose +' é inválido.';
  }
  return result;
}

module.exports = function api(options){

  this.add('role:api,path:create', function(msg,respond){
    var name = {
      verbose: 'Nome',
      field_name: 'name'
    }
    var hospital_id = {
      verbose: 'Id de Hospital',
      field_name: 'hospital_id'
    }
    result = {}
    name.value = msg.args.body.name
    hospital_id.value = msg.args.body.hospital_id    

    result = validate_field(name, result)
    result = validate_id(hospital_id, result)

    if (Object.entries(result)[0]) {
      console.log("Result:");
      console.log(result);
      result.success = false;
      respond(null, result)
    // else, everything sucess
    } else {
      this.act('role:sector,cmd:create', {
        name: name.value,
        hospital_id: hospital_id.value
      }, respond)
    }
  })

  this.add('role:api,path:list', function(msg,respond) {
    this.act('role:sector, cmd:list',{
    },respond)
  });

  this.add('role:api,path:error', function(msg, respond){
    this.act('role:sector, cmd:error',{}, respond)
  });


  this.add('init:api', function (msg,respond){
    this.act('role:web',{routes: {
      prefix: '/api/sector',
      pin:    'role:api,path:*',
      map: {
        create: { POST:true,
                    auth: {
                      strategy: 'jwt',
                      fail: '/api/sector/error',
                    }
                  },
        list: { GET:true,
                    auth: {
                      strategy: 'jwt',
                      fail: '/api/sector/error',
                    }
                  },
        error: {GET:true}
      }
    }}, respond)
  });
}
