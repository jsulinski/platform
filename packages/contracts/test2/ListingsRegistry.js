import assert from 'assert'
import helper from './_helper'

const initialListingsLength = 0
const ipfsHash = '0x6b14cac30356789cd0c39fec0acc2176c3573abdb799f3b17ccc6972ab4d39ba'

describe('ListingsRegistry.sol', async function() {
  var web3, accounts, deploy, server, instance, owner, notOwner

  before(async function() {
    ({ deploy, accounts, web3, server } = await helper(
      `${__dirname}/../contracts/`
    ))

    owner = accounts[0]
    notOwner = accounts[1]

    instance = await deploy('ListingsRegistry', { from: owner })
  })

  after(function() {
    server.close()
  })

  it('should have owner as owner of contract', async function() {
    let contractOwner = await instance.methods.owner().call()
    assert.equal(contractOwner, owner)
  })

  it('should deploy with 0 listings', async function() {
    let listingCount = await instance.methods.listingsLength().call()
    assert.equal(Number(listingCount), 0)
  })

  it('should be able to create a listing', async function() {
    const initPrice = 2
    const initUnitsAvailable = 5
    await instance.methods.create(ipfsHash, initPrice, initUnitsAvailable).send({ from: owner })
    let listingCount = await instance.methods.listingsLength().call()
    assert.equal(listingCount, initialListingsLength + 1, 'listings count has incremented')

    let listing = await instance.methods.getListing(initialListingsLength).call()
    assert.equal(listing[1], owner, 'lister is correct')
    assert.equal(listing[2], ipfsHash, 'ipfsHash is correct')
    assert.equal(listing[3], initPrice, 'price is correct')
    assert.equal(listing[4], initUnitsAvailable, 'unitsAvailable is correct')
  })

})
