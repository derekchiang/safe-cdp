pragma solidity ^0.4.24;

contract PepInterface {
    function peek() public returns (bytes32, bool);
}

contract TokenInterface {
    function allowance(address, address) public view returns (uint);
    function balanceOf(address) public view returns (uint);
    function approve(address, uint) public;
    function transfer(address, uint) public returns (bool);
    function transferFrom(address, address, uint) public returns (bool);
    function deposit() public payable;
    function withdraw(uint) public;
    function burn(address, uint) public;
}

contract VoxInterface {
    function par() public returns (uint);
}

contract TubInterface {
    VoxInterface public vox;  // Target price feed
    function open() public returns (bytes32);
    function join(uint) public;
    function exit(uint) public;
    function lock(bytes32, uint) public;
    function free(bytes32, uint) public;
    function draw(bytes32, uint) public;
    function wipe(bytes32, uint) public;
    function give(bytes32, address) public;
    function shut(bytes32) public;
    function cups(bytes32) public view returns (address, uint, uint, uint);
    function gem() public view returns (TokenInterface);
    function gov() public view returns (TokenInterface);
    function skr() public view returns (TokenInterface);
    function sai() public view returns (TokenInterface);
    function mat() public view returns (uint);
    function ink(bytes32) public view returns (uint);
    function tab(bytes32) public view returns (uint);
    function rap(bytes32) public view returns (uint);
    function per() public view returns (uint);
    function pep() public view returns (PepInterface);
    function tag() public view returns (uint wad);
}

contract SafeCDPFactory {
    // Map from user address to the Safe CDPs they own
    mapping(address => address[]) userToSafeCDPs;
    // A set of all Safe CDPs ever created
    mapping(address => bool) safeCDPSet;

    address tubAddr; 
    address daiAddr;
    address sponsorPoolAddr;

    constructor(address _tubAddr, address _daiAddr, address _sponsorPoolAddr) public {
        tubAddr = _tubAddr;
        daiAddr = _daiAddr;
        sponsorPoolAddr = _sponsorPoolAddr;
    }

    // targetCollateralization: the collateralization ratio that keepers
    // should keep the CDP at. E.g. 200.
    //
    // marginCallThreshold: the collateralization ratio at which the CDP
    // is deemed unsafe. E.g. 180.
    //
    // marginCallDuration: the amount of time the owner has to respond to
    // a margin call. E.g. 72 hours.
    // 
    // rewardForKeeper: the percentage of debt used to reward keepers and
    // sponsors for their service. E.g. 10
    function createSafeCDP(
        bytes32 _cup,
        uint _targetCollateralization,
        uint _marginCallThreshold,
        uint _marginCallDuration,
        uint _rewardForKeeper) public returns (address) {
        SafeCDP cdp = new SafeCDP(
            tubAddr,
            daiAddr,
            sponsorPoolAddr,
            _cup,
            _targetCollateralization,
            _marginCallThreshold,
            _marginCallDuration,
            _rewardForKeeper);
        userToSafeCDPs[msg.sender].push(address(cdp));
        safeCDPSet[address(cdp)] = true;
    }
}

contract SafeCDP {

    struct DebtPayment {
        // The amount of the payment
        uint amount;
        // The time when the payment was made
        uint time;
    }

    event MarginCall(address keeper, uint amount);

    // tub is the global cdp record store
    // https://github.com/makerdao/sai/blob/master/DEVELOPING.md
    TubInterface tub;
    TokenInterface dai;
    SponsorPoolInterface sponsorPool;

    bytes cup;

    // The unit of target collateralization and margin call threshold is the
    // same as the unit for liquidation ratio in the SAI contracts, which are
    // all denominated by RAY:
    // https://github.com/makerdao/dai.js/blob/7d20ed9d64e1add128f4fa39b76c72ac4489c34d/src/utils/constants.js#L5
    uint targetCollateralization;
    uint marginCallThreshold;

    uint marginCallDuration;
    uint rewardForKeeper;


    // Map from the keeper address to the debt payments they have made
    mapping(address => DebtPayment[]) debtPaid;

    constructor(
        address _tubAddr,
        address _daiAddr,
        address _sponsorPoolAddr,
        bytes32 _cdp,
        uint _targetCollateralization,
        uint _marginCallThreshold,
        uint _marginCallDuration,
        uint _rewardForKeeper) public {

        tub = TubInterface(_tubAddr);
        dai = TokenInterface(_daiAddr);
        sponsorPool = SponsorPoolInterface(_sponsorPoolAddr);
        cup = _cup;
        targetCollateralization = _targetCollateralization;
        marginCallThreshold = _marginCallThreshold;
        marginCallDuration = _marginCallDuration;
        rewardForKeeper = _rewardForKeeper;
    }

    function marginCall() public {
        require(!safe(), "Current collateralization is not below the margin call threshold.");

        uint debtToPay = diffWithTargetCollateral();
        sponsorPool.claimPayment(debtToPay);
        tub.wipe(cup, debtToPay);
        debtPaid[msg.sender].push(DebtPayment(debtToPay, now));

        emit MarginCall(msg.sender, debtToPay);
    }

    function withdrawOwnedCollateral() public {

    }

    // Pay debt to keepers in response to a margin call.
    //
    // Although only the owner has any reason to pay debt, there seems to be
    // no harm in allowing anyone to pay debt, similar to how anyone can wipe
    // any CDP's debt.
    function payDebt() public returns (uint debtID) {
        
    }

    function totalAccuredDebt() public view returns (uint) {

    }

    // Returns whether the collateralization is above the margin call ratio.
    // Adopted from: https://github.com/makerdao/sai/blob/0dd0a799e4746ac1955b67898762cff9b71aea17/src/tub.sol#L241
    function safe() public view returns (bool) {
        var pro = rmul(tub.tag(), tub.ink(cup));
        var con = rmul(tub.vox.par(), tub.tab(cup));
        var min = rmul(con, marginCallThreshold);
        return pro >= min;
    }

    // The difference between the total amount of collateral right now, 
    function diffWithTargetCollateral() public view returns () {
        var con = rmul(tub.vox.par(), tub.tab(cup));
        var pro = rmul(tub.tag(), tub.ink(cup));
        return con - pro / targetCollateral;
    }

}