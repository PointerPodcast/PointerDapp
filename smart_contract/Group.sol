pragma solidity >=0.4.22 <0.7.0;

import "./ITimeMachineChat.sol";

contract Group is IGroup{

  //Since indexed params cost more then normal one, only groupName has been indexed
  //In this case, make sense to index also the "from" but just to show an alternative filtering mechanism:
  //Example: If you want to filter by "from", just filter from the Website/App backend 
  event Message(bytes32 indexed groupName, bytes32 from, bytes32 message, bool encrypted);

  event Donation(bytes32 indexed groupName, bytes32 from);


  ITimeMachineChat tmc;
  address payable admin; 
  bytes32 groupName;
  uint pos;


  
  constructor(address payable _admin, bytes32 _groupName, uint _pos) public{
    tmc = ITimeMachineChat(msg.sender); 
    admin = _admin;
    groupName = _groupName;
    pos = _pos;
  }

  modifier isAdmin(){
    require(msg.sender == admin, "You are not the admin of this group");
    _;
  }
  
  modifier isTMC(){
    require(msg.sender == address(tmc), "You are not the tmc's group");
    _;
  }
  
  function getGroupName() external view override returns(bytes32){
    return groupName;
  }

  function getPosition() external view override returns(uint){
    return pos;
  }

  //Only the TimeMachineChat contract can call this function
  function updatePosition(uint _pos) external override isTMC{
    pos = _pos;
  }

  //Only registered address can send message. tmc.getUsername reverts in case the sender has no username
  //Can I put encrypted data on the blockchain? Yes, but it's not GDPR compliant
  function sendEventMessage(bytes32 _message, bool encrypted) external override{
    bytes32 username = tmc.getUsername(); 
    emit Message(groupName, username , _message, encrypted);
  }

//------------------------------------------------------------

  //Just show that it costs more than an event! 
  struct CostlyMessage{
    bytes32 sender;
    bytes32 lastMessage;
  }

  CostlyMessage cMessage;

  function sendCostlyMessage(bytes32 _message) external override{
    bytes32 username = tmc.getUsername();
    cMessage.sender = username;
    cMessage.lastMessage = _message;    
  }

//------------------------------------------------------------

  function sendDonation(bytes32 _username) external payable override{
    require(msg.value > 0);
    address payable to = payable(tmc.getAddress(_username));
    to.transfer(msg.value); 
    emit Donation(groupName, tmc.getUsername());
  }


  function closeGroup() external override isAdmin{
    tmc.deleteGroup(); 
    selfdestruct(admin);
  }

}
