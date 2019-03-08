const assert = require('assert')
const DAX = artifacts.require('DAX.sol')
const ERC20 = artifacts.require('ERC20.sol')
let dax = {}
let token = {}
let transaction

contract('DAX', accounts => {
    beforeEach(async () => {
        token = await ERC20.new()
        console.log('Deployed token', token.address)
        dax = await DAX.new()
        console.log('Deployed DAX', dax.address)
    })
    it('Should whitelist 2 tokens BAT and HYDRO', async () => {
        const token = 'TOKEN'
        const pairs = ['BAT', 'HYDRO']

        transaction = dax.whitelistToken(token, token.address, pairs)
        await awaitConfirmation(transaction)
        const isWhitelisted = dax.isTokenSymbolWhitelisted(fillBytes32WithSpaces(token))
        console.log('Is whitelisted?', isWhitelisted)
    })
})

function awaitConfirmation(transaction) {
    return new Promise((resolve, reject) => {
        transaction.on('confirmation', number => {
            if(number == 3) resolve()
        })
    })
}

// To test bytes32 functions
function fillBytes32WithSpaces(name) {
    let nameHex = web3.utils.toHex(name)
    for(let i = nameHex.length; i < 66; i++) {
        nameHex = nameHex + '0'
    }
    return nameHex
}
