const DAX = artifacts.require('./DAX.sol')
const ERC20 = artifacts.require('./ERC20.sol')

module.exports = async (deployer, network) => {
    if(network != 'live'){
        console.log('Deploying contracts...')
        await deployer.then(() => {
            DAX.new()
            ERC20.new()
        })
    }
}
