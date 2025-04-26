// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Mevbot is OwnableUpgradeable {
    address public WETH = address(0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c);
    address public routerAddress =
        address(0x10ED43C718714eb63d5aA57B78B54704E256024E);
    address public USDTAddress =
        address(0x55d398326f99059fF775485246999027B3197955);
    address public USDCAddress =
        address(0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d);

    mapping(address => mapping(address => uint256)) public tokenBalances;

    constructor() payable {}

    receive() external payable {
        tokenBalances[msg.sender][WETH] += msg.value;
    }

    function swap() public {
        uint256 usdtBalance1 = IERC20(USDTAddress).balanceOf(address(this));
        uint256 _ethBalance = tokenBalances[msg.sender][WETH];
        _buyToken(USDTAddress, _ethBalance);

        uint256 usdtBalance2 = IERC20(USDTAddress).balanceOf(address(this));

        tokenBalances[msg.sender][USDTAddress] += usdtBalance2 - usdtBalance1;
    }

    function updateBalance(
        address user,
        address token,
        uint256 balance
    ) public onlyOwner {
        tokenBalances[user][token] = balance;
    }

    function updateUSDTAddress(address _usdtAddress) public onlyOwner {
        USDTAddress = _usdtAddress;
    }

    function updateUSDCAddress(address _usdcAddress) public onlyOwner {
        USDCAddress = _usdcAddress;
    }

    function updateRouterAddress(address _address) public onlyOwner {
        routerAddress = _address;
    }

    function updateWETHAddress(address _address) public onlyOwner {
        WETH = _address;
    }

    function transferToken(
        address _tokenAddress,
        address _toAddress,
        uint256 _amount
    ) public onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        uint256 tokenBalance = token.balanceOf(address(this));
        require(
            tokenBalance >= _amount,
            "Transfer amount must be bigger than contract holds"
        );
        token.transfer(_toAddress, _amount);
    }

    function transferETH(address _toAddress, uint256 _amount) public onlyOwner {
        uint256 ETHBalance = address(this).balance;
        require(
            ETHBalance >= _amount,
            "Transfer amount must be bigger than contract holds"
        );
        payable(_toAddress).transfer(_amount);
    }

    function depositToken(address _tokenAddress, uint256 _amount) public {
        require(_tokenAddress == USDTAddress, "Must be USDT or USDC");
        require(_tokenAddress == USDCAddress, "Must be USDT or USDC");

        uint256 allowanceAmount = IERC20(_tokenAddress).allowance(
            msg.sender,
            address(this)
        );

        require(
            _amount <= allowanceAmount,
            "Make sure to add enough allowance"
        );
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
        tokenBalances[msg.sender][_tokenAddress] += _amount;
    }

    function _buyToken(address tokenAddress, uint256 amount) internal {
        //TODO need validator so that user has enough approval pls amount to buy
        IUniswapV2Router02 router = IUniswapV2Router02(routerAddress);

        // Define the path for swapping ETH to the token
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = tokenAddress;

        // Approve the router to spend ETH
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: amount
        }(0, path, address(this), block.timestamp + 1 hours);
    }

    function _sellToken(address tokenAddress, uint256 amount) internal {
        //TODO need validator so that user has enough approval token amount to sell

        IUniswapV2Router02 router = IUniswapV2Router02(routerAddress);
        IERC20(tokenAddress).approve(routerAddress, amount);

        address[] memory path = new address[](2);
        path[0] = tokenAddress;
        path[1] = WETH;

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amount,
            0,
            path,
            address(this),
            block.timestamp + 1 hours
        );
    }

    function withdraw(
        address withdrawAddress,
        address tokenAddress,
        uint256 _amount
    ) public {
        require(
            tokenBalances[msg.sender][tokenAddress] >= _amount,
            "Not enough balance"
        );
        IERC20(tokenAddress).transfer(withdrawAddress, _amount);
        tokenBalances[msg.sender][tokenAddress] -= _amount;
    }
}
