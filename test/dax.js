const assert = require('assert')
const DAX = artifacts.require('DAX.sol')
const ERC20 = artifacts.require('ERC20.sol')
const emptyBytes = 0x0000000000000000000000000000000000000000
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
        const escrowAddress = await dax.escrowByUserAddress(accounts[0])
        const balance = parseInt(await token.balanceOf(escrowAddress))

        assert.ok(escrowAddress != emptyBytes, 'The escrow address must be set')
        assert.equal(balance, amount, 'The balance must be equal to the amount of tokens deposited')
    })
    it('Should extract tokens successfully after a deposit', async () => {
        const tokenAddress = token.address
        const amount = 100

        console.log('User balance before', parseInt(await token.balanceOf(accounts[0])))

        transaction = token.approve(dax.address, amount)
        await awaitConfirmation(transaction)
        transaction = dax.depositTokens(tokenAddress, amount)
        await awaitConfirmation(transaction)
        transaction = dax.extractTokens(tokenAddress, amount)
        await awaitConfirmation(transaction)

        console.log('User balance after', parseInt(await token.balanceOf(accounts[0])))
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
