pragma solidity 0.4.24;

library SafeMath {
    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
     * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @return the address of the owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    /**
     * @dev Allows the current owner to relinquish control of the contract.
     * @notice Renouncing to ownership will leave the contract without an owner.
     * It will not be possible to call the functions with the `onlyOwner`
     * modifier anymore.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }}

contract Sponsor is Ownable{
  using SafeMath for uint;

  event newDeposit(address sponsor, uint depositAmount);
  event newWithdrawPrincipal(address sponsor, uint withdrawAmount);
  event newWithdrawInterest(address sponsor, uint withdrawAmount);

  mapping (address => uint) public sponsorDepositBalance;
  mapping (address => uint32) public readyTime;
  //mapping (address => bool) public isReady;

  uint totalPrinciple;
  uint totalInterest;
  uint coolDownTime = 3 days;
  uint8 public constant decimals = 18;
  //_tokens * (10 ** uint256(decimals))

  //address tokenContractAddress = 0x46b6a419c0aF78c1b1f240334015A6DFBeF7f3F2; //DAI Kovan Contract
  address tokenContractAddress = 0x692a70D2e424a56D2C6C27aA97D1a86395877b3A;
  DaiToken contractToken = DaiToken(tokenContractAddress);

  //Sponsor Contract Address: 0xbbf289d846208c16edc8474705c748aff07732db
  //My Address: 0xca35b7d915458ef540ade6068dfe2f44e8fa733c
  //1000000000000000000000000


  modifier onlySafeCDP() {
    //require(safeCDPSet? == True);
    _;
  }

  //Sponsor deposits funds into the pool
  function deposit(uint _depositAmount) public {
    //uint tokenAllowanceAmount = tokenAllowance(msg.sender, address(this));
    //require(tokenAllowanceAmount >= _depositAmount);
    tokenTransferFrom(msg.sender,address(this), _depositAmount);
    totalPrinciple = totalPrinciple.add(_depositAmount);
    sponsorDepositBalance[msg.sender] = sponsorDepositBalance[msg.sender].add(_depositAmount);
    emit newDeposit(msg.sender, _depositAmount);
    readyTime[msg.sender] = uint32(now + coolDownTime);
    //isReady[msg.sender] = false;
  }

  function balanceOfContract() view external onlyOwner returns (uint) {
    return address(this).balance;
  }
  function _isReady() internal view returns (bool) {
      return (readyTime[msg.sender] <= now);
  }


  //Sponsor withdraws the amount
  function withdraw() public {
    //Example: 100 = totalInterest, from 10000 pool, sponsor deposited 1000
    //100*1000/10000 = 10
    //Sponsor can withdraw 1010
    //After withdraw => totalInterest = 90, Pool = 9000, sponsor deposited = 0;
    //Deposits again 1000 => totalInterest = 90, Pool = 10000, sponsor deposited = 1000;
    //Withraws agains => 90*1000/10000 = 9
    require(sponsorDepositBalance[msg.sender] > 0);
    require(_isReady());
    uint interest = totalInterest * (sponsorDepositBalance[msg.sender] / totalPrinciple);
    uint totalWithdraw = interest + sponsorDepositBalance[msg.sender];
    uint contractBalance = contractToken.balanceOf(this);
    require(contractBalance.sub(totalWithdraw)>=0);
    sponsorDepositBalance[msg.sender] = 0;
    totalPrinciple = totalPrinciple.sub(sponsorDepositBalance[msg.sender]);
    totalInterest = totalInterest.sub(interest);
    tokenTransfer(msg.sender,totalWithdraw);
    emit newWithdrawPrincipal(msg.sender, sponsorDepositBalance[msg.sender]);
    emit newWithdrawInterest(msg.sender, interest);
  }

  //Keeper Allowance
  function approvePayment(uint _approvePaymentAmount) public onlySafeCDP {
    tokenTransfer(msg.sender,_approvePaymentAmount);
  }

  function returnDebt(uint _principalAmount, uint _interestAmount) public onlySafeCDP {
    totalPrinciple = totalPrinciple.add(_principalAmount);
    totalInterest = totalInterest.add(_interestAmount);
  }

  function changeCoolDownTime(uint _newCoolDownTime) public onlyOwner {
      coolDownTime = _newCoolDownTime;
  }

  function checkUserTokenBalance() public view returns(uint256){return contractToken.balanceOf(msg.sender);}
  function checkContractTokenBalance() public view returns(uint256){return contractToken.balanceOf(this);}
  function tokenAllowance(address _owner, address _spender) public view returns(uint){return contractToken.allowance(_owner, _spender);}
  function tokenTransferFrom(address _from, address _to, uint256 _value) public returns(bool){contractToken.transferFrom(_from, _to, _value);}
  function tokenTransfer(address _to, uint256 _amount) public onlySafeCDP returns(bool){contractToken.transfer(_to, _amount);}
  function tokenApprove(address _to, uint256 _amount) public onlySafeCDP returns(bool){contractToken.approve(_to, _amount);}

}

contract DaiToken {
    function totalSupply() public pure returns (uint);
    function balanceOf(address tokenOwner) public pure returns (uint balance);
    function transfer(address _to, uint _value) public returns (bool success);
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner,address indexed spender,uint256 value);
    event Transfer(address indexed from, address indexed to, uint tokens);
}
