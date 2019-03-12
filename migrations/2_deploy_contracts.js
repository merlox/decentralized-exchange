const DAX = artifacts.require('./DAX.sol')
const ERC20 = artifacts.require('./ERC20.sol')

module.exports = async (deployer, network) => {
    if(network != 'live'){
        console.log('Deploying contracts...')
        await deployer.then(() => {
            return ERC20.new('Basic attention token', 'BAT', {
                gas: 8e6
            })
        }).then(deployedToken => {
            console.log('BAT token address', deployedToken.address)
            return ERC20.new('Water', 'WAT', {
                gas: 8e6
            })
        }).then(deployedWater => {
            console.log('WAT token address', deployedWater.address)
            return DAX.new({
                gas: 8e6
            })
        }).then(deployedDax => {
            console.log('Deployed DAX address', deployedDax.address)
        })
    }
}

// Deploy 2 tokens that will be our pairs
