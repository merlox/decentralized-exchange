const assert = require('assert')
const DAX = artifacts.require('DAX.sol')
let dax = {}

contract('DAX', accounts => {
    beforeEach(async () => {
        dax = await DAX.new()
    })
})
