pragma solidity 0.5.4;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Escrow {
    address payable public owner;

    modifier onlyOwner {
        require(msg.sender == owner, 'You must be the owner to execute that function');
        _;
    }

    /// @notice This contract accepts ETH transfers
    function () external payable {}

    /// @notice To setup the initial tokens that the user will store when creating the escrow
    /// @param _owner The address that will be the owner of this escrow, must be the owner of the tokens
    constructor (address payable _owner) public {
        require(_owner != address(0), 'The owner address must be set');
        owner = _owner;
    }

    /// @notice To transfer tokens to another address, usually the buyer or seller of an existing order
    function transferTokens(address _token, address _to, uint256 _amount) public onlyOwner {
        require(_token != address(0), 'The token address must be set');
        require(_to != address(0), 'The receiver address must be set');
        IERC20(_token).transfer(_to, _amount);
    }

    /// @notice To receive the funds from this contract to the owner of it
    /// @param _token The address of the token to extract
    /// @param _amount The number of tokens to extract
    function extractFunds(address _token, uint256 _amount) public onlyOwner {
        require(_token != address(0), 'The token address must be set');
        IERC20(_token).transfer(owner, _amount);
    }

    /// @notice Same thing as the previous function but will all the tokens
    /// @param _token The address of the token to extract
    function extractAllFunds(address _token) public onlyOwner {
        require(_token != address(0), 'The token address must be set');
        uint256 balance = checkTokenBalance(_token);
        IERC20(_token).transfer(owner, balance);
    }

    /// @notice To extract ether to the owner address from this contract
    /// @param _amount The number of ETH to extract in WEI
    function extractEther(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, 'You cant extract more Eth than whats available inside this contract');
        owner.transfer(_amount);
    }

    /// @notice To see how many of a particular token this contract contains
    /// @param _token The address of the token to check
    /// @return uint256 The number of tokens this contract contains
    function checkTokenBalance(address _token) public view returns(uint256) {
        require(_token != address(0), 'The token address must be set');
        return IERC20(_token).balanceOf(address(this));
    }
}
