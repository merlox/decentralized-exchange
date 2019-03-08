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
        const tokenBytes = fillBytes32WithSpaces('TOKEN')
        const pairBytes = [fillBytes32WithSpaces('BAT'), fillBytes32WithSpaces('HYDRO')]

        transaction = dax.whitelistToken(tokenBytes, token.address, pairBytes)
        await awaitConfirmation(transaction)
        const isWhitelisted = await dax.isTokenSymbolWhitelisted(tokenBytes)
        const validPairs = await dax.getTokenPairs(tokenBytes)
        console.log('Valid pairs', web3.utils.toUtf8(validPairs[0]), web3.utils.toUtf8(validPairs[1]))
        assert.ok(isWhitelisted, 'The token must be whitelisted')
    })
    it('Should deposit tokens correctly and create a valid Escrow contract', async () => {
        const tokenAddress = token.address
        const amount = 100

        transaction = token.approve(dax.address, amount)
        await awaitConfirmation(transaction)
        transaction = dax.depositTokens(tokenAddress, amount)
        await awaitConfirmation(transaction)

        console.log('Escrow address', await dax.escrowByUserAddress(accounts[0]))
    })
})

function awaitConfirmation(transaction) {
    return new Promise((resolve, reject) => {
        transaction.on('confirmation', number => {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
            if(number == 3) {
                process.stdout.write('Confirmation ' + number + '\n')
                resolve()
            } else {
                process.stdout.write('Confirmation ' + number)
            }
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
