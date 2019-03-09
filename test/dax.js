const assert = require('assert')
const DAX = artifacts.require('DAX.sol')
const ERC20 = artifacts.require('ERC20.sol')
const emptyBytes = 0x0000000000000000000000000000000000000000
let dax = {}
let token = {}
let hydroToken = {}
let batToken = {}
let transaction

contract('DAX', accounts => {
    beforeEach(async () => {
        token = await ERC20.new()
        console.log('Deployed token', token.address)
        hydroToken = await ERC20.new()
        console.log('Hydro token deployed', hydroToken.address)
        batToken = await ERC20.new()
        console.log('Bat token deployed', batToken.address)
        dax = await DAX.new()
        console.log('Deployed DAX', dax.address)
    })
    it('Should whitelist 2 tokens BAT and HYDRO', async () => {
        const tokenBytes = fillBytes32WithSpaces('TOKEN')
        const pairBytes = [fillBytes32WithSpaces('BAT'), fillBytes32WithSpaces('HYDRO')]
        const pairAddresses = [batToken.address, hydroToken.address]

        console.log('Whitelisting tokens...')
        transaction = dax.whitelistToken(tokenBytes, token.address, pairBytes, pairAddresses)
        await awaitConfirmation(transaction)
        const isWhitelisted = await dax.isTokenSymbolWhitelisted(tokenBytes)
        const validPairs = await dax.getTokenPairs(tokenBytes)
        assert.ok(isWhitelisted, 'The token must be whitelisted')
        assert.deepEqual(pairBytes, validPairs, 'The token pairs added must be valid')
    })
    it('Should deposit tokens correctly and create a valid Escrow contract', async () => {
        const tokenAddress = token.address
        const amount = 100

        // Whitelist the tokens before anything
        console.log('Whitelisting tokens...')
        const tokenBytes = fillBytes32WithSpaces('TOKEN')
        const pairBytes = [fillBytes32WithSpaces('BAT'), fillBytes32WithSpaces('HYDRO')]
        const pairAddresses = [batToken.address, hydroToken.address]
        transaction = dax.whitelistToken(tokenBytes, token.address, pairBytes, pairAddresses)
        await awaitConfirmation(transaction)
        const isWhitelisted = await dax.isTokenSymbolWhitelisted(tokenBytes)
        const validPairs = await dax.getTokenPairs(tokenBytes)
        assert.ok(isWhitelisted, 'The token must be whitelisted')
        assert.deepEqual(pairBytes, validPairs, 'The token pairs added must be valid')

        // Deposit the tokens
        console.log('Depositing tokens...')
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
        const initialTokens = parseInt(await token.balanceOf(accounts[0]))

        // Whitelist the tokens before anything
        console.log('Whitelisting tokens...')
        const tokenBytes = fillBytes32WithSpaces('TOKEN')
        const pairBytes = [fillBytes32WithSpaces('BAT'), fillBytes32WithSpaces('HYDRO')]
        const pairAddresses = [batToken.address, hydroToken.address]
        transaction = dax.whitelistToken(tokenBytes, token.address, pairBytes, pairAddresses)
        await awaitConfirmation(transaction)
        const isWhitelisted = await dax.isTokenSymbolWhitelisted(tokenBytes)
        const validPairs = await dax.getTokenPairs(tokenBytes)
        assert.ok(isWhitelisted, 'The token must be whitelisted')
        assert.deepEqual(pairBytes, validPairs, 'The token pairs added must be valid')

        // Do the token deposit
        console.log('Depositing tokens...')
        transaction = token.approve(dax.address, amount)
        await awaitConfirmation(transaction)
        transaction = dax.depositTokens(tokenAddress, amount)
        await awaitConfirmation(transaction)
        assert.equal(parseInt(await token.balanceOf(accounts[0])), initialTokens - 100, 'You must deposit the tokens succesfully first')

        // Extract the tokens
        transaction = dax.extractTokens(tokenAddress, amount)
        await awaitConfirmation(transaction)
        assert.equal(parseInt(await token.balanceOf(accounts[0])), initialTokens, 'You must have the same balance as when you started')
    })
    it('Should create a buy limit order succesfully', async () => {
        const type = fillBytes32WithSpaces('buy')
        const firstSymbol = fillBytes32WithSpaces('TOKEN')
        const secondSymbol = fillBytes32WithSpaces('HYDRO')
        const quantity = 100
        const pricePerToken = 40
        const secondSymbolPrice = quantity * pricePerToken
        const initialHydroTokens = parseInt(await hydroToken.balanceOf(accounts[0]))

        // Whitelist the tokens before anything
        console.log('Whitelisting tokens...')
        const tokenBytes = fillBytes32WithSpaces('TOKEN')
        const pairBytes = [fillBytes32WithSpaces('BAT'), fillBytes32WithSpaces('HYDRO')]
        const pairAddresses = [batToken.address, hydroToken.address]
        transaction = dax.whitelistToken(tokenBytes, token.address, pairBytes, pairAddresses)
        await awaitConfirmation(transaction)
        const isWhitelisted = await dax.isTokenSymbolWhitelisted(tokenBytes)
        const validPairs = await dax.getTokenPairs(tokenBytes)
        assert.ok(isWhitelisted, 'The token must be whitelisted')
        assert.deepEqual(pairBytes, validPairs, 'The token pairs added must be valid')

        // Deposit the tokens
        console.log('Depositing tokens...')
        transaction = hydroToken.approve(dax.address, secondSymbolPrice)
        await awaitConfirmation(transaction)
        transaction = dax.depositTokens(hydroToken.address, secondSymbolPrice)
        await awaitConfirmation(transaction)
        const escrowAddress = await dax.escrowByUserAddress(accounts[0])
        const balance = parseInt(await hydroToken.balanceOf(escrowAddress))
        assert.equal(parseInt(await hydroToken.balanceOf(accounts[0])), initialHydroTokens - secondSymbolPrice, 'You must deposit the tokens succesfully first')

        transaction = dax.limitOrder(type, firstSymbol, secondSymbol, quantity, pricePerToken)
        await awaitConfirmation(transaction)
        const counter = parseInt(await dax.orderIdCounter())
        const buyOrdersFirst = await dax.buyOrders(0)

        assert.ok(counter == 1, 'The counter must increase after a succesful limit order creation')
        assert.equal(buyOrdersFirst.price, pricePerToken, 'The price per token should be set')
        assert.equal(buyOrdersFirst.quantity, quantity, 'The price per token should be set')
        assert.equal(buyOrdersFirst.orderType, type, 'The order type should be set')
    })

    it('Should create a sell limit order succesfully', async () => {
        const type = fillBytes32WithSpaces('sell')
        const firstSymbol = fillBytes32WithSpaces('TOKEN')
        const secondSymbol = fillBytes32WithSpaces('HYDRO')
        const quantity = 500
        const pricePerToken = 10
        const firstSymbolPrice = quantity * pricePerToken
        const initialTokens = parseInt(await token.balanceOf(accounts[0]))

        // Whitelist the tokens before anything
        console.log('Whitelisting tokens...')
        const tokenBytes = fillBytes32WithSpaces('TOKEN')
        const pairBytes = [fillBytes32WithSpaces('BAT'), fillBytes32WithSpaces('HYDRO')]
        const pairAddresses = [batToken.address, hydroToken.address]
        transaction = dax.whitelistToken(tokenBytes, token.address, pairBytes, pairAddresses)
        await awaitConfirmation(transaction)
        const isWhitelisted = await dax.isTokenSymbolWhitelisted(tokenBytes)
        const validPairs = await dax.getTokenPairs(tokenBytes)
        assert.ok(isWhitelisted, 'The token must be whitelisted')
        assert.deepEqual(pairBytes, validPairs, 'The token pairs added must be valid')

        // Deposit the tokens
        console.log('Depositing tokens...')
        transaction = token.approve(dax.address, firstSymbolPrice)
        await awaitConfirmation(transaction)
        transaction = dax.depositTokens(token.address, firstSymbolPrice)
        await awaitConfirmation(transaction)
        const escrowAddress = await dax.escrowByUserAddress(accounts[0])
        const balance = parseInt(await token.balanceOf(escrowAddress))
        assert.equal(parseInt(await token.balanceOf(accounts[0])), initialTokens - firstSymbolPrice, 'You must deposit the tokens succesfully first')

        transaction = dax.limitOrder(type, firstSymbol, secondSymbol, quantity, pricePerToken)
        await awaitConfirmation(transaction)
        const counter = parseInt(await dax.orderIdCounter())
        const sellOrdersFirst = await dax.sellOrders(0)

        assert.ok(counter == 1, 'The counter must increase after a succesful limit order creation')
        assert.equal(sellOrdersFirst.price, pricePerToken, 'The price per token should be set')
        assert.equal(sellOrdersFirst.quantity, quantity, 'The price per token should be set')
        assert.equal(sellOrdersFirst.orderType, type, 'The order type should be set')
    })

})

function awaitConfirmation(transaction) {
    let number = 0
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
