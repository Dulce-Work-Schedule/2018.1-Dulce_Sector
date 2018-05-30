var Seneca = require('seneca')
var assert = require('assert')
var chai = require('chai')


var expect = chai.expect;

function test_sector_seneca (fin){
  return Seneca({log: 'test'})
  .test(fin)

  .use("entity")
  .use(require('../_sector'))
}

describe('Create sector', function() {

  it('Sector entity creation', function(fin){
    var seneca = test_sector_seneca(fin)

    seneca.act({
      role: 'sector',
      cmd: 'create',
      name: 'Pediatria'
    }, function(err, result){
      expect(result.name).to.equal('Pediatria')
      fin()
    })
  })
});
